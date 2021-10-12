import React from "react"
import { Link } from "gatsby"
import { useLocation } from "@reach/router"
import { useDispatch, useSelector } from "react-redux"
import {
  SVGList,
  SVGWallet,
  SVGSun,
  SVGMoon,
  SVGCardano,
} from "@/svg"
import * as style from "./style.module.scss"
import { Tooltip } from "antd"

const config = [
  {
    title: "Cardanolist Map",
    url: "/",
  },
  {
    title: "Upcoming ICOs",
    url: "/",
    disabled: true,
  },
]

const Menu = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.settings.theme)

  const changeTheme = () => {
    dispatch({
      type: "settings/CHANGE_THEME",
      theme: theme === "default" ? "dark" : "default",
    })
  }

  const switchMegaMenu = () => {
    dispatch({
      type: "settings/SWITCH_MEGA_MENU",
    })
  }

  return (
    <div>
      <div className="ray__block mb-0">
        <div className={style.menu}>
          <Link to="/" className={`${style.menuLogo} me-4`}>
            <SVGList />
            <span>
              <strong>CardanoList.io</strong>
            </span>
          </Link>
          <span className="text-muted flex-grow-1 d-none d-sm-inline pe-2 pe-md-4">
            Curated list of{" "}
            <span className={style.menuCardano}>
              <SVGCardano />
            </span>{" "}
            Cardano projects by Ray Network
          </span>
          <span className="ms-auto me-3 d-none d-sm-inline">
            <a
              href="https://raywallet.io"
              className="ant-btn ray__btn ray__btn--round"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="ray__icon pe-2">
                <SVGWallet />
              </span>
              <span>RayWallet</span>
            </a>
          </span>
          <span
            className={`cursor-pointer me-3 ms-auto ms-sm-0 ${style.menuSwitch}`}
            onClick={changeTheme}
            onKeyPress={changeTheme}
            role="button"
            tabIndex="0"
          >
            <span className={theme === "default" ? "" : "d-none"}>
              <span className="ray__icon">
                <SVGSun />
              </span>
            </span>
            <span className={theme !== "default" ? "" : "d-none"}>
              <span className="ray__icon">
                <SVGMoon />
              </span>
            </span>
          </span>
          <span
            className={`${style.menuIcon} cursor-pointer`}
            onClick={switchMegaMenu}
            onKeyPress={switchMegaMenu}
            role="button"
            tabIndex="0"
            aria-label="Open Menu"
          />
        </div>
        <div style={{ maxWidth: 1300 }}>
          {config.map((item, index) => {
            const isActive =
              location.pathname === "/"
                ? item.url === location.pathname
                : item.url === "/"
                  ? false
                  : location.pathname.includes(item.url)
            return (
              <span key={index} className={style.linksContainer}>
                {item.disabled && (
                  <Tooltip title="Soon">
                    <span
                      className={`${style.linksLink} ${style.linksLinkDisabled} ${isActive ? style.linksLinkActive : ""
                        }`}
                    >
                      <div className={style.linksLinkContainer}>
                        <span className={style.linksLinkTitle}>{item.title}</span>
                        <span>{item.title}</span>
                      </div>
                    </span>
                  </Tooltip>
                )}
                {!item.external && !item.disabled && (
                  <Link
                    to={item.url}
                    className={`${style.linksLink} ${isActive ? style.linksLinkActive : ""
                      }`}
                  >
                    <div className={style.linksLinkContainer}>
                      <span className={style.linksLinkTitle}>{item.title}</span>
                      <span>{item.title}</span>
                    </div>
                  </Link>
                )}
              </span>
            )
          })}
        </div>
      </div>
      <div className="ray__line mt-3 mb-4" />
    </div>
  )
}

export default Menu
