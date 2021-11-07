import React, { useState, useEffect } from "react"
import { Checkbox, Radio, Modal, Tooltip, Table, message } from "antd"
import { saveAs } from 'file-saver'
import { toPng } from 'html-to-image'
import store from 'store'
import { format } from 'date-fns'
import Masonry from "react-masonry-component"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { SVGCardano, SVGCamera, SVGGithub, SVGHome, SVGTwitter } from "@/svg"
import { fetchRawUrl, githubUrl } from "@/services/github"
import * as style from "./style.module.scss"
import { groupBy, uniqBy } from "lodash"

const urls = {
  projects: 'ray-network/cardano-verified/main/projects',
  tokens: 'ray-network/cardano-verified/main/tokens',
  nft: 'ray-network/cardano-verified/main/nft',
}

const columnsProjects = [
  {
    title: "",
    key: "logo",
    width: 40,
    render: (record, records) => {
      return (
        <div className={style.tableIcon}>
          <a href={records.url} target="_blank" rel="noopener noreferrer">
            <img
              src={`${githubUrl + urls.projects}/icon/${records.icon}`}
              alt={records.name}
            />
          </a>
        </div>
      )
    },
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (record, records) => <a href={records.url} target="_blank" rel="noopener noreferrer">{record}</a>
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    render: (record) => <div className="min-width-500">{record}</div>
  },
  {
    title: "Links",
    dataIndex: "url",
    key: "url",
    render: (record, records) => {
      return (
        <div>
          {records.url && (
            <a
              href={records.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ray__link me-3"
            >
              Home
            </a>
          )}
          {records.twitter && (
            <a
              href={records.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="ray__link"
            >
              Twitter
            </a>
          )}
        </div>
      )
    },
  },
]

const columnsRegular = [
  {
    title: "",
    key: "logo",
    width: 40,
    render: (record, records) => {
      return (
        <div className={style.tableIcon}>
          <a href={records.url} target="_blank" rel="noopener noreferrer">
            <img
              src={`${githubUrl + urls.tokens}/icon/${records.icon}`}
              alt={records.name}
            />
          </a>
        </div>
      )
    },
  },
  {
    title: "Ticker",
    dataIndex: "ticker",
    key: "ticker",
    render: (record, records) => <a href={records.url} target="_blank" rel="noopener noreferrer">{record}</a>
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (record, records) => <a href={records.url} target="_blank" rel="noopener noreferrer">{record}</a>
  },
  {
    title: "Fingerprint",
    dataIndex: "fingerprint",
    key: "fingerprint",
    render: (record, records) => <a href={`https://cardanoscan.io/token/${records.fingerprint}`} target="_blank" rel="noopener noreferrer">{record}</a>
  },
  {
    title: "Links",
    dataIndex: "url",
    key: "url",
    render: (record, records) => {
      return (
        <div>
          {records.url && (
            <a
              href={records.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ray__link me-3"
            >
              Home
            </a>
          )}
        </div>
      )
    },
  },
]

const columnsNFT = [
  {
    title: "",
    key: "logo",
    width: 40,
    render: (record, records) => {
      return (
        <div className={style.tableIcon}>
          <a href={records.url} target="_blank" rel="noopener noreferrer">
            <img
              src={`${githubUrl + urls.nft}/icon/${records.icon}`}
              alt={records.name}
            />
          </a>
        </div>
      )
    },
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (record, records) => <a href={records.url} target="_blank" rel="noopener noreferrer">{record}</a>
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    render: (record) => <div className="text-wrap min-width-500">{record}</div>,
  },
  {
    title: "Links",
    dataIndex: "url",
    key: "url",
    render: (record, records) => {
      return (
        <div>
          <a
            href={records.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ray__link me-3"
          >
            Home
          </a>
          <a
            href={records.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="ray__link"
          >
            Twitter
          </a>
        </div>
      )
    },
  },
]

const List = () => {
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState(store.get('CARDANOLIST.view') || 'List')
  const [checkedList, setCheckedList] = useState([])
  const [categoriesList, setCategoriesList] = useState([])
  const [modalVisibe, setModalVisible] = useState(false)
  const [modalData, setModalData] = useState()
  const [updated, setUpdated] = useState()

  const [projects, setProjects] = useState({})
  const [tokens, setTokens] = useState([])
  const [nft, setNft] = useState([])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line
  }, [])

  const openModal = (e, data, type) => {
    e.preventDefault()
    setModalData({
      type,
      data,
    })
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const onChangeCategory = list => {
    setCheckedList(list)
  }

  const onChangeView = e => {
    const value = e.target.value
    setView(value)
    store.set('CARDANOLIST.view', value)
  }

  const fetchData = async () => {
    const { data: dataProjects } = await fetchRawUrl(`${urls.projects}/list.json`)
    const { data: dataTokens } = await fetchRawUrl(`${urls.tokens}/list.json`)
    const { data: dataNft } = await fetchRawUrl(`${urls.nft}/list.json`)

    const categories = uniqBy(dataProjects.data, 'category').map((item) => item.category)
    setCategoriesList([...categories, 'Tokens', 'NFT'])
    setCheckedList([...categories, 'Tokens', 'NFT'])

    setProjects(groupBy(dataProjects.data, 'category'))
    setTokens(dataTokens.data)
    setNft(dataNft.data)
    setUpdated([dataProjects.updated, dataTokens.updated, dataNft.updated].reduce((a, b) => {
      return new Date(a) > new Date(b) ? a : b;
    }))
    setTimeout(() => {
      setLoading(false)
    }, 200)
  }

  const saveList = () => {
    toPng(document.getElementById('screenshotList'))
      .then(function (dataUrl) {
        saveAs(dataUrl, 'cardanolist.png');
      })
  }

  const saveModal = (name) => {
    toPng(document.getElementById('screenshotModal'))
      .then(function (dataUrl) {
        saveAs(dataUrl, `${name}.png`);
      })
  }

  const onCopy = () => {
    message.success('Copied')
  }

  const Category = ({ data, title, type }) => {
    return (
      <div>
        <div>
          <div className={style.listTitle}>
            {title}
          </div>
        </div>
        <div className={style.listItemContainer}>
          {data.map((item, index) => <Item key={index} data={item} type={type} />)}
        </div>
      </div>
    )
  }

  const Item = ({ data, type }) => {
    const url = urls[type]
    return (
      <a
        href={data.url}
        className={style.listItem}
        onClick={(e) => openModal(e, data, type)}
        onKeyPress={(e) => openModal(e, data, type)}
        role="button"
        tabIndex="-1"
      >
        {view === 'List' && (
          <>
            <span className={style.listItemImage}>
              <img src={`${githubUrl + url}/icon/${data.icon}`} alt={data.name} />
            </span>
            <span>{type === 'tokens' ? data.ticker : data.name}</span>
          </>
        )}
        {view === 'Icon' && (
          <Tooltip title={data.name}>
            <span className={style.listItemIcon}>
              <img src={`${githubUrl + url}/icon/${data.icon}`} alt={data.name} />
            </span>
          </Tooltip>
        )}
        {view === 'Logo' && (
          <Tooltip title={data.name}>
            <span className={style.listItemLogo}>
              <img src={`${githubUrl + url}/${type === 'tokens' ? 'icon' : 'logo'}/${data.icon}`} alt={data.name} />
            </span>
          </Tooltip>
        )}
      </a>
    )
  }

  const projectsProcessed = {}
  const projectsArray = []

  Object.keys(projects)
    .filter((key) => checkedList.includes(key))
    .forEach((key) => {
      projectsProcessed[key] = projects[key]
      projectsArray.push(...projects[key])
    })

  return (
    <div>
      {loading && (
        <div className="ray__block text-center mb-0">
          <div class="spinner-border spinner-border-lg text-primary mt-5" role="status"><span class="visually-hidden">Loading...</span></div>
        </div>
      )}
      {!loading && (
        <div>
          <div className="ray__block mb-0">
            <div className={style.categories}>
              <Checkbox.Group options={categoriesList} value={checkedList} onChange={onChangeCategory} />
            </div>
            <div className="mb-2">
              <Radio.Group options={['List', 'Icon', 'Logo', 'Table']} value={view} onChange={onChangeView} />
            </div>
          </div>
          <div className="ray__block">
            <div className={style.screenOuter}>
              <div className={style.screen} id="screenshotList">
                <div className={style.banner}>
                  <Tooltip title="Visit Github">
                    <a
                      className="github"
                      href="https://github.com/ray-network/cardano-verified/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <SVGGithub />
                    </a>
                  </Tooltip>
                  <Tooltip title="Take a screenshot">
                    <span
                      className="icn"
                      onClick={() => saveList()}
                      onKeyPress={() => saveList()}
                      role="button"
                      tabIndex="-1"
                    >
                      <SVGCamera />
                    </span>
                  </Tooltip>
                  <div className={style.bannerFlex}>
                    <div className="d-flex">
                      <div>
                        <div className={style.logo}>
                          <SVGCardano />
                        </div>
                      </div>
                      <div>
                        <h1 className="mb-0">
                          <strong>30DotsList.io</strong>
                        </h1>
                        <div className="text-muted">
                          Cardano Ecosystem
                        </div>
                      </div>
                    </div>
                    <div className={`${style.bannerFlexInfo} text-muted`}>
                      <div>Curated by thirtydotslist.io</div>
                      <div>{updated && `Updated ${format(new Date(updated), 'MMMM dd, yyyy HH:mm')}`}</div>
                    </div>
                  </div>
                </div>
                <div>
                  {view !== 'Table' && (
                    <Masonry className={`${checkedList.length === 1 ? style.listSingle : ''} ${checkedList.length === 2 ? style.listDouble : ''}`}>
                      {Object.keys(projectsProcessed).map((key) => {
                        return (
                          <div key={key} className={style.list}>
                            <Category data={projects[key]} title={key} type="projects" />
                          </div>
                        )
                      })}
                      {checkedList.includes('Tokens') && (
                        <div className={style.list}>
                          <Category data={tokens} title="Tokens" type="tokens" />
                        </div>
                      )}
                      {checkedList.includes('NFT') && (
                        <div className={style.list}>
                          <Category data={nft} title="NFT" type="nft" />
                        </div>
                      )}
                    </Masonry>
                  )}
                  {view === 'Table' && (
                    <div>
                      {projectsArray.length > 0 && (
                        <div>
                          <h5><strong>Projects</strong></h5>
                          <div className={style.tableResponsive}>
                            <Table
                              dataSource={projectsArray}
                              columns={columnsProjects}
                              pagination={false}
                            />
                          </div>
                        </div>
                      )}
                      {checkedList.includes('Tokens') && (
                        <div>
                          <h5><strong>Regular Tokens</strong></h5>
                          <div className={style.tableResponsive}>
                            <Table
                              dataSource={tokens}
                              columns={columnsRegular}
                              pagination={false}
                            />
                          </div>
                        </div>
                      )}
                      {checkedList.includes('NFT') && (
                        <div>
                          <h5><strong>NFT Projects</strong></h5>
                          <div className={style.tableResponsive}>
                            <Table
                              dataSource={nft}
                              columns={columnsNFT}
                              pagination={false}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        title={null}
        footer={null}
        visible={modalVisibe}
        onCancel={closeModal}
        width={640}
        centered
        className={style.modal}
      >
        <div className={style.modalWrapper} id="screenshotModal">
          <div className="d-flex align-items-center mb-3">
            {modalData?.type === 'projects' && (
              <div className={style.modalLogo}>
                <img src={`${githubUrl + urls[modalData?.type]}/logo/${modalData?.data?.icon}`} alt={modalData?.data?.name} />
              </div>
            )}
            {modalData?.type === 'tokens' && (
              <>
                <div className={style.modalLogo}>
                  <img src={`${githubUrl + urls[modalData?.type]}/icon/${modalData?.data?.icon}`} alt={modalData?.data?.ticker} />
                </div>
                <h5 className="mb-0">
                  <strong>{modalData?.data?.ticker}</strong>
                </h5>
              </>
            )}
            {modalData?.type === 'nft' && (
              <div className={style.modalLogo}>
                <img src={`${githubUrl + urls[modalData?.type]}/logo/${modalData?.data?.icon}`} alt={modalData?.data?.name} />
              </div>
            )}
          </div>
          <div>
            {modalData?.type === 'nft' && (
              <img className={style.modalNft} src={`${githubUrl + urls[modalData?.type]}/example/${modalData?.data?.policies[0]}.png`} alt={modalData?.data?.name} />
            )}
            <div className="mb-2">
              Name: {modalData?.data?.name}
            </div>
            <div className="mb-2 clearfix">
              {modalData?.data?.description}
            </div>
          </div>
          {modalData?.type === 'tokens' && modalData?.data?.fingerprint !== 'ada' && (
            <div className="mb-2">
              Fingerpint:{" "}
              <CopyToClipboard text={modalData?.data?.fingerprint} onCopy={onCopy}>
                <Tooltip title="Copy">
                  <span className={style.modalLink}>
                    {modalData?.data?.fingerprint}
                  </span>
                </Tooltip>
              </CopyToClipboard>
            </div>
          )}
          {modalData?.type === 'nft' && (
            <div className="mb-2">
              <div>Known Policies:</div>
              {modalData?.data?.policies?.map((policy) => {
                return (
                  <CopyToClipboard text={policy} onCopy={onCopy}>
                    <Tooltip title="Copy">
                      <span className={style.modalLink}>
                        {policy}
                      </span>
                    </Tooltip>
                  </CopyToClipboard>
                )
              })}
            </div>
          )}
          <div className={`${style.modalLinks} mb-2`}>
            {modalData?.data?.url && (
              <span>
                <span className="icn me-2">
                    <SVGHome />
                  </span>
                <a href={modalData?.data?.url} target="_blank" rel="noopener noreferrer" className="me-3">
                  {(modalData?.data?.url).replace('https://', '')}
                </a>
              </span>
            )}
            {modalData?.data?.twitter && (
              <a href={modalData?.data?.twitter} target="_blank" rel="noopener noreferrer">
                <span className="icn me-2">
                  <SVGTwitter />
                </span>
                {(modalData?.data?.twitter).replace('https://', '')}
              </a>
            )}
          </div>
          <div className={style.modalFooter}>
            <Tooltip title="Take a screenshot">
              <span
                className="icn me-2"
                onClick={() => saveModal(modalData?.data?.name)}
                onKeyPress={() => saveModal(modalData?.data?.name)}
                role="button"
                tabIndex="-1"
              >
                <SVGCamera />
              </span>
            </Tooltip>
            <span className="text-muted">Curated by thirtydotslist.io</span>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default List
