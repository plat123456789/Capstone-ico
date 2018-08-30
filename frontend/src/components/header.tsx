import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
// import { toggleCollapsedNav } from "actions/Setting";
// import CardHeader from "components/dashboard/Common/CardHeader/index";
// import { COLLAPSED_DRAWER, FIXED_DRAWER } from "constants/ActionTypes";
import * as React from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import SearchBox from "./searchBox";
// import Menu from "components/TopNav/Menu";
import UserInfoPopup from "./userInfoPopup";

interface IHeaderProps {
  [key: string]: any;
}

interface IHeaderstate {
  [key: string]: any;
}

class Header extends React.Component<IHeaderProps, IHeaderstate> {
  public constructor(props: any) {
    super(props);
    this.state = {
      anchorEl: undefined,
      searchBox: false,
      searchText: "",
      mailNotification: false,
      userInfo: false,
      langSwitcher: false,
      appNotification: false
    };
  }
  public onAppNotificationSelect = () => {
    this.setState({
      appNotification: !this.state.appNotification
    });
  };
  public onMailNotificationSelect = () => {
    this.setState({
      mailNotification: !this.state.mailNotification
    });
  };
  public onLangSwitcherSelect = (event: any) => {
    this.setState({
      langSwitcher: !this.state.langSwitcher,
      anchorEl: event.currentTarget
    });
  };
  public onSearchBoxSelect = () => {
    this.setState({
      searchBox: !this.state.searchBox
    });
  };
  public onUserInfoSelect = () => {
    this.setState({
      userInfo: !this.state.userInfo
    });
  };
  public handleRequestClose = () => {
    this.setState({
      langSwitcher: false,
      userInfo: false,
      mailNotification: false,
      appNotification: false,
      searchBox: false
    });
  };

  public onToggleCollapsedNav = (e: any) => {
    const val = !this.props.navCollapsed;
    this.props.toggleCollapsedNav(val);
  };

  public updateSearchText(evt: any) {
    this.setState({
      searchText: evt.target.value
    });
  }

  public render() {
    // const {
    //   drawerType,
    //   locale,
    //   navigationStyle,
    //   horizontalNavPosition
    // } = this.props;

    // const drawerStyle = drawerType.includes(FIXED_DRAWER)
    //   ? "d-block d-xl-none"
    //   : drawerType.includes(COLLAPSED_DRAWER)
    //     ? "d-block"
    //     : "d-none";

    return (
      <AppBar className="app-main-header app-main-header-top">
        <Toolbar className="app-toolbar" disableGutters={false}>
          <div
            className="d-block d-md-none pointer mr-3"
            onClick={this.onToggleCollapsedNav}
          >
            <span className="jr-menu-icon">
              <span className="menu-icon" />
            </span>
          </div>

          <Link className="app-logo mr-2 d-none d-sm-block" to="/">
            <img
              src="http://via.placeholder.com/177x65"
              alt="app-logo"
              title="app-logo"
            />
          </Link>

          <SearchBox
            styleName="d-none d-lg-block"
            placeholder=""
            // onChange={this.updateSearchText.bind(this)}
            // value={this.state.searchText}
          />

          <ul className="header-notifications list-inline ml-auto">
            <li className="d-inline-block d-lg-none list-inline-item">
              <Dropdown
                className="quick-menu nav-searchbox"
                // isOpen={this.state.searchBox}
                // toggle={this.onSearchBoxSelect.bind(this)}
              >
                <DropdownToggle
                  className="d-inline-block"
                  tag="span"
                  data-toggle="dropdown"
                >
                  <IconButton className="icon-btn size-30">
                    <i className="zmdi zmdi-search zmdi-hc-fw" />
                  </IconButton>
                </DropdownToggle>

                <DropdownMenu right={true} className="p-0">
                  <SearchBox
                    styleName="search-dropdown"
                    placeholder=""
                    // onChange={this.updateSearchText.bind(this)}
                    // value={this.state.searchText}
                  />
                </DropdownMenu>
              </Dropdown>
            </li>

            <li className="list-inline-item">
              <Dropdown
                className="quick-menu"
                // isOpen={this.state.langSwitcher}
                // toggle={this.onLangSwitcherSelect.bind(this)}
              >
                <DropdownToggle
                  className="d-inline-block"
                  tag="span"
                  data-toggle="dropdown"
                >
                  <div className="d-flex align-items-center pointer pt-1">
                    {/* <i className={`flag flag-24 flag-${locale.icon}`} /> */}
                  </div>
                </DropdownToggle>

                <DropdownMenu right={true} className="w-50">
                  {/* <LanguageSwitcher
                    switchLanguage={this.props.switchLanguage}
                    handleRequestClose={this.handleRequestClose}
                  /> */}
                </DropdownMenu>
              </Dropdown>
            </li>
            <li className="list-inline-item app-tour">
              <Dropdown
                className="quick-menu"
                // isOpen={this.state.appNotification}
                // toggle={this.onAppNotificationSelect.bind(this)}
              >
                <DropdownToggle
                  className="d-inline-block"
                  tag="span"
                  data-toggle="dropdown"
                >
                  <IconButton className="icon-btn size-20 font-size-20">
                    <i className="zmdi zmdi-notifications-active icon-alert animated infinite wobble" />
                  </IconButton>
                </DropdownToggle>

                <DropdownMenu right={true}>
                  {/* <CardHeader
                    styleName="align-items-center"
                    heading="appNotification.title"
                  /> */}
                </DropdownMenu>
              </Dropdown>
            </li>
            <li className="list-inline-item mail-tour">
              <Dropdown
                className="quick-menu"
                // isOpen={this.state.mailNotification}
                // toggle={this.onMailNotificationSelect.bind(this)}
              >
                <DropdownToggle
                  className="d-inline-block"
                  tag="span"
                  data-toggle="dropdown"
                >
                  <IconButton className="icon-btn size-20 font-size-20">
                    <i className="zmdi zmdi-comment-alt-text icon-alert zmdi-hc-fw" />
                  </IconButton>
                </DropdownToggle>

                <DropdownMenu right={true}>
                  {/* <CardHeader styleName="align-items-center" heading="AAA" /> */}
                </DropdownMenu>
              </Dropdown>
            </li>

            <li className="list-inline-item user-nav">
              <Dropdown
                className="quick-menu"
                // isOpen={this.state.userInfo}
                // toggle={this.onUserInfoSelect.bind(this)}
              >
                <DropdownToggle
                  className="d-inline-block"
                  tag="span"
                  data-toggle="dropdown"
                >
                  <IconButton className="icon-btn size-30">
                    <Avatar
                      alt="..."
                      src="http://via.placeholder.com/150x150"
                      className="size-30"
                    />
                  </IconButton>
                </DropdownToggle>

                <DropdownMenu right={true}>
                  <UserInfoPopup />
                </DropdownMenu>
              </Dropdown>
            </li>
          </ul>
        </Toolbar>
      </AppBar>
    );
  }
}

export default Header;
