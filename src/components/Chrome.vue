<template>
	<div class="app">
		<ChromeTabbar ref="tabs" :tabbar="tabbar"></ChromeTabbar>
		<ChromeNavbar ref="navbar" :navbar="navbar"></ChromeNavbar>
		<div class="content">
			<ChromeFrame :ref="'page-' + index" v-for="(bPage, index) in bPages" :index="index" :key="index" :b-page="bPage"></ChromeFrame>
		</div>
	</div>
</template>

<script>
import ChromeTabbar from './Chrome/ChromeTabbar';
import ChromeNavbar from './Chrome/ChromeNavbar';
import ChromeFrame from './Chrome/ChromeFrame';
function createPageObject(location = 'https://www.baidu.com/') {
	return {
		location: location,
		statusText: false,
		title: '',
		isLoading: false,
		isSearching: false,
		canGoBack: false,
		canGoForward: false,
		canRefresh: false
	};
}

export default {
	components: {
		ChromeTabbar,
		ChromeNavbar,
		ChromeFrame
	},
	data() {
		return {
			pages: [createPageObject()],
			currentPageIndex: 0
		};
	},
	computed: {
		tabbar() {
			return {
				pages: this.pages,
				currentPageIndex: this.currentPageIndex,
				onNewTab: this.onNewTab,
				onTabClick: this.onTabClick,
				onTabClose: this.onTabClose,
				onEnterLocation: this.onEnterLocation
			};
		},
		navbar() {
			return {
				pages: this.pages,
				currentPageIndex: this.currentPageIndex,
				onEnterLocation: this.onEnterLocation
			};
		},
		bPages() {
			return this.pages.map((page, i) => {
				if (!page) {
					return;
				}
				return {
					pageIndex: i,
					pages: this.pages,
					currentPageIndex: this.currentPageIndex,
					onNewTab: this.onNewTab,
					onPageTitleSet: this.onPageTitleSet
				};
			});
		}
	},
	methods: {
		navigateTo(l) {
			this.$refs.webview.setAttribute('src', l);
		},
		getPage(i) {
			i = typeof i === 'undefined' ? this.currentPageIndex : i;
			return this.$refs['page-' + i][0];
		},
		onTabClose(e, page, pageIndex) {
			this.closeTab(pageIndex);
		},
		closeTab(pageIndex) {
			//最后一天tab不允许删除
			if (this.pages.length <= 1) {
				return;
			}
			this.pages.splice(pageIndex, 1);
			//find thi nearest adjacent page to make active

			for (let i = pageIndex; i >= 0; i--) {
				if (this.pages[i]) {
					return (this.currentPageIndex = i);
				}
			}
			for (let i = pageIndex; i < this.pages.length; i++) {
				if (this.pages[i]) {
					return (this.currentPageIndex = i);
				}
			}
		},
		onTabClick(e, page, pageIndex) {
			this.currentPageIndex = pageIndex;
		},
		onNewTab(url) {
			let obj = null;
			if (url) {
				obj = createPageObject(url);
			} else {
				obj = createPageObject();
			}
			this.pages.push(obj);
			this.currentPageIndex = this.pages.length - 1;
		},
		//navbar
		onClickHome() {
			// this.getWebView().goToIndex(0);
		},
		onEnterLocation(location) {
			this.getPage().navigateTo(location);
		},
		onPageTitleSet(e) {
			var page = this.pages[this.currentPageIndex];
			page.title = e.title;
			page.location = this.$refs['page-' + this.currentPageIndex][0].$refs.webview.getURL();
		}
	}
};
</script>

<style lang="scss" scoped>
.app {
	display: flex;
	flex-direction: column;
	height: 100%;
	border: 1px solid #f5f5f5;
}
.content {
	flex-grow: 1;
	display: flex;
}
</style>
