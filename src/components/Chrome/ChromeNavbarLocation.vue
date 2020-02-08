<template>
	<input type="text" @keyup.enter="onKeyUpEnter" v-model="loc.page.location" />
</template>

<script>
function normalizedUri(input) {
	var prefix = 'https://';

	if (!/^([^:/]+)(:\/\/)/g.test(input) && !prefix.includes(input)) {
		input = prefix + input;
	}

	return input;
}
export default {
	props: ['loc'],
	methods: {
		onKeyUpEnter(e) {
			this.loc.onEnterLocation(normalizedUri(e.target.value));
		}
	}
};
</script>

<style lang="scss" scoped></style>
