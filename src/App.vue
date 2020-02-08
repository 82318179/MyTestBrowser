<template>
	<Chrome></Chrome>
</template>
<script>
import Chrome from './components/Chrome';
export default {
	components: {
		Chrome
	}
};
</script>
<style>
:root {
	--border-radius: 4px;
}
body {
	margin: 0;
	padding: 0;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
html,
body {
	height: 100%;
	overflow: hidden;
}
ul {
	margin: 0;
	padding: 0;
}
li {
	list-style: none;
}
*,
*::before,
*::after {
	box-sizing: border-box;
}
</style>
