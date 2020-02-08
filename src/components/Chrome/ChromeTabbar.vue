<template>
	<div class="container webkit-draggable">
		<ul class="tabs">
			<chrome-tab v-for="(tab, index) in tabs" :index="index" :key="index" :tab="tab"></chrome-tab>
			<div @click="tabbar.onNewTab('https://www.baidu.com/')" class="add" />
		</ul>
		<div class="custom-buttons">
			<svg @click="min">
				<use xlink:href="../../assets/icons.svg#minimize-window" />
			</svg>
			<svg @click="max">
				<use v-if="isMaxed" xlink:href="../../assets/icons.svg#restore-window" />
				<use v-else xlink:href="../../assets/icons.svg#maximize-window" />
			</svg>
			<svg class="close" @click="close">
				<use xlink:href="../../assets/icons.svg#close-window" />
			</svg>
		</div>
	</div>
</template>

<script>
//import path from "path";
import ChromeTab from './ChromeTab';
import { remote } from 'electron';
export default {
	props: ['tabbar'],
	data() {
		return {
			isMaxed: false
		};
	},
	computed: {
		tabs() {
			return this.tabbar.pages.map((page, i) => {
				if (!page) {
					return;
				}
				let isActive = this.tabbar.currentPageIndex === i;
				let onClose = e => {
					e.preventDefault();
					e.stopPropagation();
					this.tabbar.onTabClose(e, page, i);
				};
				let onClick = e => {
					this.tabbar.onTabClick(e, page, i);
				};
				return {
					page,
					isActive,
					onClose,
					onClick
				};
			});
		}
	},
	components: {
		ChromeTab
	},
	methods: {
		min() {
			remote.getCurrentWindow().minimize();
		},
		close() {
			remote.getCurrentWindow().close();
		},
		max() {
			const browserWindow = remote.getCurrentWindow();
			if (this.isMaxed) {
				this.isMaxed = !this.isMaxed;
				browserWindow.unmaximize();
			} else {
				this.isMaxed = !this.isMaxed;
				browserWindow.maximize();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
$background-color: #f5f5f5;
$border: #ccc;
$border-radius: 4px;
.container {
	display: flex;
	align-items: center;
	background-color: $background-color;
	&.webkit-draggable {
		-webkit-app-region: drag;
	}

	.tabs {
		flex-grow: 1;
		display: flex;
		align-items: center;
		height: 36px;
		padding: 8px 20px 0 12px;
	}
	.add {
		-webkit-app-region: no-drag;
		background-color: #d0d0d0;
		width: 26px;
		height: 15px;
		border-radius: 2px;
		margin-left: 8px;
		border: 1px solid $border;
		transform: skewX(25deg);
		cursor: pointer;
		&:hover {
			background-color: #d9d9d9;
		}
	}
	.custom-buttons {
		box-sizing: initial;
		display: flex;
		width: 120px;
		padding-left: 30px;
		align-items: center;
		justify-content: space-between;

		svg {
			box-sizing: initial;
			width: 10px;
			height: 10px;
			padding: 11px 15px;
			opacity: 1;
			-webkit-app-region: no-drag;

			&:hover {
				background: #bbb;
			}
			&.close:hover {
				color: white;
				background: #f52424;
			}

			&:active {
				opacity: 0.8;
			}
		}
	}
}
</style>
