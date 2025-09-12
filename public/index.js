/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Entry.ts":
/*!**********************!*\
  !*** ./src/Entry.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Matrix */ \"./src/Matrix.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\n\r\nclass Entry {\r\n    constructor() {\r\n        this.initialize = () => __awaiter(this, void 0, void 0, function* () {\r\n            (yield _Matrix__WEBPACK_IMPORTED_MODULE_0__[\"default\"].initialize()).show();\r\n        });\r\n        this.initialize();\r\n    }\r\n}\r\nnew Entry();\r\n\n\n//# sourceURL=webpack://html-static-myself/./src/Entry.ts?\n}");

/***/ }),

/***/ "./src/Matrix.ts":
/*!***********************!*\
  !*** ./src/Matrix.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nclass Matrix {\r\n    constructor() {\r\n        this.initialize = () => __awaiter(this, void 0, void 0, function* () {\r\n            this._page = document.getElementById(\"view-page\");\r\n            this._container = document.createElement(\"div\");\r\n            this._container.id = \"container\";\r\n            this._container.width = \"100%\";\r\n            this._container.style.setProperty('z-index', '9999');\r\n            this._container.style.setProperty(\"position\", \"absolute\");\r\n            this._graphic = document.createElement(\"canvas\");\r\n            this._container.appendChild(this._graphic);\r\n            document.onmousemove = () => this.hide();\r\n            //      Controls.addEventListener(Events.CHANGE_TRACE_VISIBILITY, () => { \r\n            //           this._enabled = !this._enabled; \r\n            //          if (this._enabled) this.will();\r\n            //       });\r\n            return this;\r\n        });\r\n        this.show = () => {\r\n            if (!this.exists()) {\r\n                this._page.appendChild(this._container);\r\n                this.matrixEffect(this._graphic);\r\n            }\r\n        };\r\n        this.hide = () => {\r\n            if (this.exists()) {\r\n                this._graphic.getContext(\"2d\").clearRect(0, 0, window.innerWidth, window.innerHeight);\r\n                this._page.removeChild(this._container);\r\n                clearInterval(this._interval);\r\n                clearTimeout(this._timeout);\r\n                this.will();\r\n            }\r\n        };\r\n        this.will = () => {\r\n            clearTimeout(this._timeout);\r\n            return (this._timeout = setTimeout(() => this.show(), 10000));\r\n        };\r\n        this.exists = () => {\r\n            return document.getElementById(\"view-page\") && document.getElementById(\"container\");\r\n        };\r\n    }\r\n    matrixEffect(canvas, font = 24) {\r\n        const context = canvas.getContext(\"2d\", { willReadFrequently: true });\r\n        const w = (canvas.width = window.innerWidth);\r\n        const h = (canvas.height = window.innerHeight);\r\n        const str = \"А+Б0ƓВڲ-Г1Д=Е2Ё Ж3З И4Йۺ К5Лإ М6Нڧ О7П ۴ڟ Ф!ڮХ ЦÛ?Ч ƪШ.іагb н ьцск бйщцгу ритй\" +\r\n            \"шлщшб пр,Ы Ь:ЭЮ;ڿڿڦЯ 开儿 艾  诶Ƣ 开伊 艾2 艾ƕڪ   西Ý 吉 3艾 %$艾 伊4 ¿ 67 娜% ڠ伊\" +\r\n            \"6a bcƜ dٿefïo#pؠ-qrstu &v* ڜ wxy3z ¼ ¾ æè ƩỺ ʭʩʥ˩˩ͼ  ͽͽΔΔΔΔω ϘϠ ϠϡϢϧ Ϩ ϬϬϪЉЊ\" +\r\n            \"1871640532 1 udp 1677729535 188.212777 typ srflx raddr 0.0.0.0 rport 0 generation 0\" +\r\n            \"ufrag AfOL network-coe:832498458 1 udp 1677729535 4147.105 55549 typ srflx\" +\r\n            \" raddr 0.0.0.0 rport 0 generation 0 ufrag 4W3O ne ϲτ χ κ ͷρ φ \tπ314 ʏ ƙ ɜ ӆ ϰ ƴ\" +\r\n            \"и̷ ய ౦ ӥ ❡ ㄐ и̷ௐ ჯ ய౦? ቀ \tჶ ෲ? ƿ ᗱ ㄏ ㄨ ȹ Ⴏ ȝ Κ Ͷ Λ  Ο Φ Η БΛЯΤЬ ❞૱ઐᙓዘҚ☯\" +\r\n            \" нaχƴй ㄨㄦ੦ഠ〇ㄇㄐ૯ㄏㄏ πiȝgyютьㄇㄈ ㄋ ㄏ ㄐ ㄒ\tㄗ ㄙ ㄚ\t ㄤ ㄥ ㄦ ㄨ ㄩ\t4TG\";\r\n        const matrix = str.split(\"\");\r\n        let cols = w / font;\r\n        let pool = [];\r\n        for (let i = 0; i < cols; i++)\r\n            pool[i] = 1;\r\n        const draw = () => {\r\n            context.fillStyle = \"rgba(0,0,0,.05)\";\r\n            context.fillRect(0, 0, w, h);\r\n            context.fillStyle = \"#00ff00\";\r\n            if (Math.random() > 0.9955) {\r\n                context.fillStyle = \"#f00\";\r\n            }\r\n            context.font = font + \"px system-ui\";\r\n            for (let i = 0; i < pool.length; i++) {\r\n                const txt = matrix[Math.floor(Math.random() * matrix.length)];\r\n                context.fillText(txt, i * font, pool[i] * font);\r\n                if (pool[i] * font > h && Math.random() > 0.95)\r\n                    pool[i] = 0;\r\n                pool[i]++;\r\n            }\r\n        };\r\n        this._interval = setInterval(draw, 77);\r\n    }\r\n}\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Matrix());\r\n\n\n//# sourceURL=webpack://html-static-myself/./src/Matrix.ts?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/Entry.ts");
/******/ 	
/******/ })()
;