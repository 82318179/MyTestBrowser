<template>
	<div id="browser-page" :class="{ hidden: !isActive }">
		<div class="container">
			<button @click="screenShot">截图</button>
			<webview src="https://www.baidu.com/" @dom-ready="ready" ref="webview" disablewebsecurity :preload="preload"></webview>
			<ChromeFrameStatus :status="status"></ChromeFrameStatus>
		</div>
	</div>
</template>

<script>
// import process from "process";
import path from 'path';
import url from 'url';
import ChromeFrameStatus from './ChromeFrameStatus';
export default {
	props: ['bPage'],
	computed: {
		page() {
			return this.bPage.pages[this.bPage.currentPageIndex];
		},
		searchInput() {
			return {
				isActive: this.page.isSearching,
				onPageSearch: this.onPageSearch
			};
		},
		status() {
			return {
				page: this.page
			};
		},
		isActive() {
			return this.bPage.pageIndex === this.bPage.currentPageIndex;
		},
		preload() {
			// return url.format({
			//   pathname: path.join(__dirname, "../../preloads/webview-preload.js"),
			//   protocol: "file:",
			//   slashes: true
			// });
			// return path.join(__dirname, "../../../public/preload.js");
			return path.join(__static, './preload.js');
		}
	},
	components: {
		ChromeFrameStatus
	},
	created() {
		this.$ipc.on('browser', (e, type, data) => {
			switch (type) {
				case 'mouseMenu':
					alert('显示右键菜单');
					break;
			}
		});
		this.$ipc.on('screenshot', (e, type, data) => {
			this.$refs.webview.send('screenshot', '打印成功');
		});
	},
	methods: {
		ready(a) {
			a.target.openDevTools();
		},
		screenShot() {
			this.$ipc.send('browser', 'screenshot');
		},
		navigateTo(l) {
			this.$refs.webview.setAttribute('src', l);
		},
		mouseMenu(e) {
			console.log(e);
		}
	},
	mounted() {
		for (let key in webviewEvents) {
			this.$refs.webview.addEventListener(key, webviewHandler(this, webviewEvents[key]));
		}
		// window.addEventListener("resize", resize);
		// resize();
		if (this.page.location) {
			this.navigateTo(this.page.location);
		}

		// try {
		//   let webContents;
		//   this.$refs.webview.addEventListener("dom-ready", () => {
		//     console.log("dom-ready");
		//     if (!webContents) {
		//       webContents = this.$refs.webview.getWebContents();
		//       webContents.on("new-window", (e, url) => {
		//         console.log("webContentsnew-window");
		//         if (!new URL(url).host) {
		//           // Handle newUrl = 'about:blank' in some cases
		//           return;
		//         }
		//         e.preventDefault();
		//         this.bPage.onNewTab(url);
		//       });
		//     }
		//   });
		// } catch (e) {
		//   // console.log("111:" + e);
		// }

		this.$refs.webview.addEventListener('new-window', e => {
			//访客页面尝试打开新的浏览器窗口时触发
			const protocol = url.parse(e.url).protocol;
			if (protocol === 'http:' || protocol === 'https:' || protocol === 'about:blank') {
				this.bPage.onNewTab(e.url);
			}
		});
	}
};
let webviewEvents = {
	'page-title-updated': 'onPageTitleSet',
	onmousedown: 'mouseMenu'
};
function webviewHandler(self, fnName) {
	//debugger;
	return function(e) {
		if (self.bPage[fnName]) self.bPage[fnName](e, self.page, self.bPage.pageIndex);
	};
}
</script>

<style lang="scss" scoped>
#browser-page {
	position: relative;
	width: 100%;
	min-height: 100%;
}
webview {
	border: 0;
	width: 100%;
	min-height: 100%;
}
.hidden {
	display: none;
}
.container {
	width: 100%;
	height: 100%;
}
.container button {
	background: #399df7;
	color: #fff;
	width: 100px;
	height: 35px;
	position: absolute;
}
</style>
