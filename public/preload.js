const remote = require('electron').remote;
console.log(remote)
const { ipcRenderer, ipcMain } = require('electron');
let html2canvas = require('./html2canvas.min');
function getURLBase64(url) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open('get', url, true);
		xhr.responseType = 'blob';
		xhr.onload = function() {
			if (this.status === 200) {
				let blob = this.response;
				let fileReader = new FileReader();
				fileReader.onloadend = function(e) {
					let result = e.target.result;
					resolve(result);
				};
				fileReader.readAsDataURL(blob);
			}
		};
		xhr.onerror = function() {
			reject();
		};
		xhr.send();
	});
}
function dataURLtoBlob(dataurl) {
	let arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}

function downloadFileByBase64(base64, name) {
	let myBlob = dataURLtoBlob(base64);
	let myUrl = URL.createObjectURL(myBlob);
	let a = document.createElement('a');
	a.setAttribute('href', myUrl);
	a.setAttribute('download', name || '截图.png');
	a.setAttribute('target', '_blank');
	let clickEvent = document.createEvent('MouseEvents');
	clickEvent.initEvent('click', true, true);
	a.dispatchEvent(clickEvent);
}

function createImag() {
	let dom = document.body;
	let width = dom.clientWidth;
	let height = dom.scrollHeight;
	html2canvas(dom, {
		width: width,
		height: height,
		useCORS: true, // 【重要】开启跨域配置
		allowTaint: true, //允许跨域图片
		taintTest: false, //是否在渲染前测试图片,
		backgroundColor: '#fff'
	}).then(canvas => {
		return downloadFileByBase64(canvas.toDataURL('image/png', 1.0), '截图.png');
	});
}
document.onreadystatechange = function() {
	if (document.readyState === 'complete') {
		Preload.init();
	}
};
let Preload = {
	init: function() {
		console.log('初始化完成');
		window.addEventListener('contextmenu', function(e) {
			ipcRenderer.send('browser', 'mouseMenu', null);
		});
		ipcRenderer.on('screenshot', (e, data) => {
			console.log('开始截图');
			this.screenShot();
		});
	},
	screenShot: function() {
		let scrollHeight = document.body.scrollHeight;
		let length = 0;
		let perfix = scrollHeight / 100;
		window.scrollTo(0, 0);
		let timer = setInterval(() => {
			if (length.toFixed(0) !== scrollHeight.toFixed(0)) {
				window.scrollTo(0, length);
				length += perfix;
			} else {
				let imgs = document.querySelectorAll('img');
				for (let i = 0; i < imgs.length; i++) {
					(function(i) {
						getURLBase64(imgs[i].src).then(r => {
							imgs[i].src = r;
						});
					})(i);
				}
				let svgElem = document.querySelectorAll('svg');
				for (let i = 0; i < svgElem.length; i++) {
					let node = svgElem[i];
					let svg = node.parentNode;
					//let svg = node.outerHTML.trim();

					//新建Image对象
					let img = new Image();
					img.crossOrigin = 'anonymous';
					//svg内容
					img.src = 'data:image/svg+xml,' + unescape(encodeURIComponent(svg)); //svg内容中可以有中文字符
					img.src = 'data:image/svg+xml,' + svg; //svg内容中不能有中文字符

					//svg编码成base64
					img.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg))); //svg内容中可以有中文字符
					img.src = 'data:image/svg+xml;base64,' + window.btoa(svg); //svg内容中不能有中文字符

					//图片初始化完成后调用
					img.onload = function() {
						//将canvas的宽高设置为图像的宽高
						let canvas = document.createElement('canvas');
						let c = canvas.getContext('2d');
						canvas.className = node.className.baseVal;
						if (node.style.position) {
							canvas.style.position += node.style.position;
							canvas.style.left += node.style.left;
							canvas.style.top += node.style.top;
						}
						canvas.width = img.width;
						canvas.height = img.height;

						//canvas画图片
						c.drawImage(img, 0, 0);

						//将图片添加到body中
						document.body.appendChild(img);
						svg.appendChild(canvas);
						svg.removeChild(node);
					};
					/*
                                        let ctx = canvas.getContext('2d');
                                        let img = new Image();
                                        let xml = (new XMLSerializer).serializeToString(svg);
                                        img.src = "data:image/svg+xml;charset=utf-8,"+xml;

                                        ctx.drawImage(img, 0, 0);


                                        parentNode.appendChild(canvas);
                                        parentNode.removeChild(node);*/
				}
				console.log('已经到底部');
				clearInterval(timer);
				createImag();
			}
		}, 50);
	}
};
