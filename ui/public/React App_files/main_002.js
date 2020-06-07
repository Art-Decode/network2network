webpackHotUpdate("main",{

/***/ "./src/scenes/account.js":
/*!*******************************!*\
  !*** ./src/scenes/account.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../App.css */ "./src/App.css");
/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_App_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _polkadot_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @polkadot/api */ "./node_modules/@polkadot/api/index.js");
/* harmony import */ var _polkadot_api__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_polkadot_api__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react95__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react95 */ "./node_modules/react95/dist/index.js");
/* harmony import */ var react95__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react95__WEBPACK_IMPORTED_MODULE_3__);
var _jsxFileName = "/home/milos/Projects/personal/hackatons/network2network/ui/src/scenes/account.js";





function AccountPage({
  ADDR
}) {
  const [balance, setBalance] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(0);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    const getApi = async () => {
      const provider = new _polkadot_api__WEBPACK_IMPORTED_MODULE_2__["WsProvider"]('wss://kusama-rpc.polkadot.io/');
      const api = await _polkadot_api__WEBPACK_IMPORTED_MODULE_2__["ApiPromise"].create({
        provider: provider
      });
      const {
        nonce,
        data: balance
      } = await api.query.system.account(ADDR);
      setBalance(balance);
    };

    getApi();
  }, []);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "App",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21,
      columnNumber: 5
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("header", {
    className: "App-header",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22,
      columnNumber: 7
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23,
      columnNumber: 9
    }
  }, ADDR), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24,
      columnNumber: 9
    }
  }, balance)));
}

/* harmony default export */ __webpack_exports__["default"] = (AccountPage);

/***/ })

})
//# sourceMappingURL=main.29c6f087d75a8260e4f6.hot-update.js.map