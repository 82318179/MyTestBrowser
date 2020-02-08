<template>
	<li @click="tab.onClick" :class="{ active: tab.isActive }" class="tab">
		<div class="content">{{ title }}</div>
		<svg viewBox="0 0 24 24" class="close" @click="tab.onClose">
			<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
		</svg>
	</li>
</template>

<script>
export default {
	props: ['tab'],
	computed: {
		title() {
			return this.tab.page.title || 'loading';
		}
	}
};
</script>

<style lang="scss" scoped>
$background-color: #dbdbdb;
$hover: #eee;
$border: #bbb;
$nav: #f2f2f2;
.tab {
	-webkit-app-region: no-drag;
	box-sizing: border-box;
	width: 218px;
	min-width: 100px;
	display: flex;
	align-items: center;
	min-width: 100px;
	position: relative;
	background-color: $background-color;
	border-top: 1px solid $border;
	margin: 0 5px;
	cursor: default;
	font-size: 0;
	transition: $background-color 0.5s;

	&:hover {
		background-color: $border;
		&::before,
		&::after {
			background-color: $border;
		}
	}
	&:nth-of-type(1) {
		&::before {
			height: 30px;
			border-bottom: 1px solid $border;
		}
		&.active {
			height: 31px;
		}
	}
	&.active {
		background-color: #fff;
		height: 31px;
		border-bottom: 1px solid #fff;
		transition: all 0s;
		z-index: 100000;
		&::before,
		&::after {
			z-index: 10;
			transition: all 0s;
			align-self: flex-start;
			height: 31px;
			background-color: #fff;
			border-bottom: 1px solid #fff;
		}
	}
	.close {
		fill: #000;
		width: 12px;
		min-width: 12px;
		height: 12px;
		border-radius: 50%;
		z-index: 100;
		margin-left: 2px;
		margin-right: 2px;
		cursor: pointer;
		&:hover {
			fill: #fff;
			background-color: #f00;
		}
	}

	&::before {
		content: '';
		position: absolute;
		z-index: 0;
		left: -1px;
		top: -1px;
		width: 16px;
		height: 26px;
		background-color: $background-color;
		border-top: 1px solid $border;
		border-left: 1px solid $border;
		transform: skewX(-25deg);
		transform-origin: left top;
		transition: background-color 0s;
	}
	&::after {
		content: '';
		position: absolute;
		z-index: 1;
		top: -1px;
		right: -1px;
		width: 16px;
		height: 30px;
		background-color: $background-color;
		border-top: 1px solid $border;
		border-right: 1px solid $border;
		border-bottom: 1px solid $border;
		transform: skewX(25deg);
		transform-origin: right top;
		transition: background-color 0s;
	}
	.content {
		flex-grow: 1;
		padding-left: 12px;
		font-size: 12px;
		line-height: 28px;
		user-select: none;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}
</style>
