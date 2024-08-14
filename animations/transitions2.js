
		let speed = 0;
		const bumpSpeed = () => {
			speed += 1;
			const s = document.getElementById('speed')
			if (speed > 2) {
				s.innerHTML = '&half;&times;';
				speed = 0;
			} else {
				s.innerHTML = `${speed}&times;`;
			}
		};

		const showStage = (s, skipAnimation) => {
			let aIn, aOut;
			if (s >= stage) {
				aIn = 'animation-in-from-right';
				aOut = 'animation-out-to-left';
			} else {
				aIn = 'animation-in-from-left';
				aOut = 'animation-out-to-right';
			}
			const same = s === stage;
			const fIn = document.getElementById(`frame${s}`);
			const fOut = document.getElementById(`frame${stage}`);
			const cb = document.getElementById('controlbar');
			const showPlay = s === 1 || s === 3;

			const hideMessages = () => {
				if (stage === 1) {
					const m11 = document.getElementById('message11');
					m11.classList.remove('show');
					const m12 = document.getElementById('message12');
					m12.classList.remove('show');
					const m13 = document.getElementById('message13');
					m13.classList.remove('show');
				}
				if (stage === 3) {
					const m31 = document.getElementById('message31');
					m31.classList.remove('show');
				}
			};

			const update = () => {
				// reset frame buttons
				const b1 = document.getElementById('b_frame1');
				b1.classList.remove('active-frame');
				b1.classList.remove('end-frame');
				const b2 = document.getElementById('b_frame2');
				b2.classList.remove('active-frame');
				b2.classList.remove('end-frame');
				const b3 = document.getElementById('b_frame3');
				b3.classList.remove('active-frame');
				b3.classList.remove('end-frame');

				// jump to first panel of stage
				const f = `stage${s}1`;
				const jump = new Function(`return ${f}()`);
				jump();

				fIn.style.display = 'block';
				if (!skipAnimation) {
					fIn.classList.add(aIn);
					fIn.addEventListener('animationend', () => {
						fIn.classList.remove(aIn);
						cb.classList.add('controlbar-in');
						cb.classList.remove('controlbar-out');
						if (showPlay) {
							showBigButton('big-play', 3000);
						}
					}, { once : true, capture: true });
				}

				if (!same) {
					if (skipAnimation) {
						fOut.style.display = 'none';
						hideMessages();
					} else {
						fOut.classList.add(aOut);
						fOut.addEventListener('animationend', () => {
							fOut.classList.remove(aOut);
							fOut.style.display = 'none';
							hideMessages();
						}, { once : true, capture: true });
					}
				}
			};

			if (skipAnimation) {
				update();
			} else {
				cb.classList.add('controlbar-out');
				cb.addEventListener('animationend', () => {
					update();
					hideMessages();
				}, { once : true, capture: true });
			}
		};

		// config: { play: hide|disable|active, pause: ..., skip: ... }
		const buttonBar= (config) => {
			const defaults = {
				play: 'hide',
				pause: 'hide',
				skip: 'hide',
			};
			const control = { ...defaults, ...config };
			for (const c in defaults) {
				const b = document.getElementById(`${c}-button`);
				switch (control[c]) {
					case 'active':
						b.style.display = 'inline-block';
						b.disabled = false;
						break;
					case 'disable':
						b.style.display = 'inline-block';
						b.disabled = true;
						break;
					default:
						console.error(`Unknown control "${control[c]}" - treating as "hide"`);
						// fall-through
					case 'hide':
						b.style.display = 'none';
						b.disabled = true;
				}
			}
		};

		let bigTimer;
		const clearBigTimer = () => {
			// return false if there was no timer running, true if there was one
			if (!bigTimer) {
				return false;
			}

			clearTimeout(bigTimer);
			bigTimer = null;
			return true;
		};

		const showBigButton = (id, delay) => {
			clearBigTimer();
			const show = () => {
				const b = document.getElementById(id)
				b.classList.remove('big-button-hide');
				b.classList.add('big-button-in');
				b.disabled = false;
			};
			if (delay) {
				bigTimer = setTimeout(show, delay);
			} else {
				show();
			}
		};

		const hideBigButton = (id) => {
			if (!clearBigTimer()) {
				const b = typeof id === 'string' ? document.getElementById(id) : id;
				b.classList.add('big-button-hide');
				b.classList.remove('big-button-out');
				b.classList.remove('big-button-in');
				b.disabled = true;
			}
		};

		const stage11 = () => {
			subStage = 11;
			buttonBar({play: 'active', skip: 'active'});

			const i = document.getElementById('image1');
			i.src = 'bags1-1.png';

			const f = document.getElementById('frame1');
			f.classList.add('pointer');

			const b1 = document.getElementById('b_frame1');
			b1.classList.add('active-frame');
		};

		const stage12 = () => {
			subStage = 12;
			buttonBar({pause: 'disable', skip: 'active'});
			const p = document.getElementById('panel1');
			p.classList.add('panel-out');
			p.addEventListener('animationend', () => {
				p.classList.add('panel-hide');
				const i = document.getElementById('image1');
				i.src = 'bags1-2.png';
				setTimeout(() => {
					p.classList.add('panel-in');
					p.classList.remove('panel-hide');
				}, 0);

				document.documentElement.style.setProperty('--message-height', m11height);
				const m11 = document.getElementById('message11');
				m11.classList.add('show');
				m11.addEventListener('animationend', () => {
					p.classList.remove('panel-out');
					p.classList.remove('panel-in');

					const w = document.getElementById('waiting');
					w.classList.add('show');

					const button = document.getElementById('addBag');
					button.classList.add('display-block');
				}, { once : true, capture: true });
			}, { once : true, capture: true });
		};

		const stage13 = () => {
			subStage = 13;
			buttonBar({pause: 'disable', skip: 'active'});
			const w = document.getElementById('waiting');
			w.classList.add('hide');
			w.addEventListener('animationend', () => {
				w.classList.remove('show');
				w.classList.remove('hide');

				const i = document.getElementById('image1');
				i.src = 'bags1-3.png';

				document.documentElement.style.setProperty('--message-height', m11height);
				const m11 = document.getElementById('message11');
				m11.classList.add('hide');
				m11.addEventListener('animationend', () => {
					m11.classList.remove('show');
					m11.classList.remove('hide');

					const button = document.getElementById('fillBags');
					button.classList.add('display-block');

					document.documentElement.style.setProperty('--message-height', m12height);
					const m12 = document.getElementById('message12');
					m12.classList.add('show');
				}, { once : true, capture: true });
			}, { once : true, capture: true });
		}

		const stage14 = () => {
			subStage = 14;
			buttonBar({pause: 'disable', skip: 'active'});

			const i = document.getElementById('image1');
			i.src = 'bags1-4.png';

			document.documentElement.style.setProperty('--message-height', m12height);
			const m12 = document.getElementById('message12');
			m12.classList.add('hide');
			m12.addEventListener('animationend', () => {
				m12.classList.remove('show');
				m12.classList.remove('hide');

				const bf = document.getElementById('b_frame2');
				bf.classList.add('end-frame');
				showBigButton('big-next', 3000);

				document.documentElement.style.setProperty('--message-height', m13height);
				const m13 = document.getElementById('message13');
				m13.classList.add('show');
			}, { once : true, capture: true });
		}

		const stage21 = () => {
			subStage = 21;
			buttonBar({pause: 'disable', skip: 'active'});

			const b2 = document.getElementById('b_frame2');
			b2.classList.add('active-frame');

			const b3 = document.getElementById('b_frame3');
			b3.classList.add('end-frame');

			showBigButton('big-next', 3000);
		}

		const stage31 = () => {
			subStage = 31;
			buttonBar({play: 'active', skip: 'hide'});
			const i = document.getElementById('image3');
			i.src = 'bags3-1.png';

			const f = document.getElementById('frame3');
			f.classList.add('pointer');

			const b3 = document.getElementById('b_frame3');
			b3.classList.add('active-frame');
		}

		const stage32 = () => {
			subStage = 32;
			buttonBar({play: 'disable', skip: 'hide'});
			const p = document.getElementById('panel3');
			p.classList.add('panel-out');
			p.addEventListener('animationend', () => {
				p.classList.add('panel-hide');
				const i = document.getElementById('image3');
				i.src = 'bags3-2.png';
				setTimeout(() => {
					p.classList.add('panel-in');
					p.classList.remove('panel-hide');
				}, 0);

				document.documentElement.style.setProperty('--message-height', m31height);
				const m31 = document.getElementById('message31');
				m31.classList.add('show');
				m31.addEventListener('animationend', () => {
					p.classList.remove('panel-out');
					p.classList.remove('panel-in');

					const done = document.getElementById('done');
					done.classList.add('display-inline-block');
				}, { once : true, capture: true });
			}, { once : true, capture: true });
		}

		const addBag = () => {
			const button = document.getElementById('addBag');
			button.classList.remove('display-block');
			stage13();
		}

		const fillBags = () => {
			const button = document.getElementById('fillBags');
			button.classList.remove('display-block');
			stage14();
		}

		let stage = 1;
		let subStage = 11;
		const jumpToStage = (s, force) => {
			if (s === stage && !force) {
				return;
			}

			// reset all classes
			const f1 = document.getElementById('frame1');
			f1.classList.remove('pointer');
			const f3 = document.getElementById('frame3');
			f3.classList.remove('pointer');

			const w = document.getElementById('waiting');
			w.classList.remove('show');

			clearBigTimer();
			hideBigButton('big-play');
			hideBigButton('big-next');

			const p1 = document.getElementById('panel1');
			p1.classList.remove('panel-out');
			p1.classList.remove('panel-in');
			const p2 = document.getElementById('panel2');
			p2.classList.remove('panel-out');
			p2.classList.remove('panel-in');
			const p3 = document.getElementById('panel3');
			p3.classList.remove('panel-out');
			p3.classList.remove('panel-in');

			const bAdd = document.getElementById('addBag');
			bAdd.classList.remove('display-block');
			const bFill = document.getElementById('fillBags');
			bFill.classList.remove('display-block');

			const done = document.getElementById('done');
			done.classList.remove('display-inline-block');

			showStage(s);
			stage = s;
		}

		const nextStage = (fade) => {
			console.log('nextStage pushed');
			const jump = () => {
				jumpToStage(stage % 3 + 1);
			}

			if (fade) {
				const b = document.getElementById('big-next')
				b.classList.remove('big-button-in');
				b.classList.add('big-button-out');
				b.addEventListener('animationend', () => {
					hideBigButton(b);
					jump();
				}, { once : true, capture: true });
			} else {
				jump();
			}
		}

		const resetStage = () => {
			jumpToStage(1, true);
		};

		const play = () => {
			console.log('play pushed');
			let fName, sName;
			switch (subStage) {
				case 11:
					fName = 'frame1';
					sName = stage12;
					break;

				case 31:
					fName = 'frame3';
					sName = stage32;
					break;

				default:
					return;
			}

			const b = document.getElementById('big-play')
			b.classList.remove('big-button-in');
			b.classList.add('big-button-out');
			b.addEventListener('animationend', () => {
				hideBigButton(b);
				const f = document.getElementById(fName);
				f.classList.remove('pointer');
				setTimeout(() => {
					sName();
				}, 0);
			}, { once : true, capture: true });
		};

		let m11height, m12height, m13height, m31height;
		const getHeight = (id) => {
			const m = document.getElementById(id);
			const h = `${m.clientHeight}px`;
			m.classList.remove('loading');
			return h;
		}

		const init = () => {
			// find the heights of various things while they are rendered but invisible
			m11height = getHeight('message11');
			m12height = getHeight('message12');
			m13height = getHeight('message13');
			m31height = getHeight('message31');

			document.documentElement.style.setProperty('--message-height', m11height);

			const w = document.getElementById('waiting');
			document.documentElement.style.setProperty('--waiting-height', `${w.clientHeight}px`);
			w.classList.remove('loading');

			const f2 = document.getElementById('frame2');
			f2.style.display = 'none';
			const f3 = document.getElementById('frame3');
			f3.style.display = 'none';

			const a = document.getElementById('animation');
			a.classList.remove('loading');

			showStage(1, true);
			showBigButton('big-play');

			bumpSpeed();

			// hack for fancy-underline on done message
			const blink = () => {
				const done = document.getElementById('done');
				done.classList.add('active');
				setTimeout(() => {
					done.classList.remove('active');
					setTimeout(() => {
						blink();
					}, 500);
				}, 1750);
			};
			setTimeout(blink, 0);
		};
