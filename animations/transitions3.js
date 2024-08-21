
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

		const addOnce = (list, token) => {
			if (list.contains(token)) {
				return false;
			}
			list.add(token);
			return true;
		};

		const removeAll = (list, token) => {
			if (!list.contains(token)) {
				return false;
			}
			while (list.contains(token)) {
				list.remove(token);
			}
			return true;
		};

		const scrollUp = () => {
			document.getElementById('scrollUp').scrollIntoView({ behavior: 'smooth' });
		};

		const showStage = (s, skipAnimation) => {
			let aIn, aOut;
			if (s >= stage) {
				aIn = `animation-in-${transitionType}-from-right`;
				aOut = `animation-out-${transitionType}-to-left`;
			} else {
				aIn = `animation-in-${transitionType}-from-left`;
				aOut = `animation-out-${transitionType}-to-right`;
			}
			const same = s === stage;
			console.log('show', stage, s, skipAnimation);
			const fIn = document.getElementById(`frame${s}`);
			const fOut = document.getElementById(`frame${stage}`);
			const cb = document.getElementById('controlbar');
			const showPlay = s === 1 || s === 3 || s === 21;

			if (!skipAnimation) {
				fIn.style['z-index'] = '10';
				fOut.style['z-index'] = '1';
			}

			const hideMessages = () => {
        const m111 = document.getElementById('message111');
        m111.classList.remove('show');
        const m112 = document.getElementById('message112');
        m112.classList.remove('show');
        const m113 = document.getElementById('message113');
        m113.classList.remove('show');
        const m131 = document.getElementById('message131');
        m131.classList.remove('show');
        const m211 = document.getElementById('message211');
        m211.classList.remove('show');
        const m221 = document.getElementById('message221');
        m221.classList.remove('show');
        const m231 = document.getElementById('message231');
        m231.classList.remove('show');
        const m241 = document.getElementById('message241');
        m241.classList.remove('show');
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
				const b4 = document.getElementById('b_frame4');
				b4.classList.remove('active-frame');
				b4.classList.remove('end-frame');

				// jump to first panel of stage
				const f = `stage${s}1`;
				const jump = new Function(`return ${f}()`);
				jump();

				fIn.style.display = 'block';
				if (!skipAnimation) {
					addOnce(fIn.classList, aIn);
					fIn.addEventListener('animationend', () => {
						fIn.style['z-index'] = '1';
						removeAll(fIn.classList, aIn);
						addOnce(cb.classList, 'controlbar-in');
						removeAll(cb.classList, 'controlbar-out');
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
						addOnce(fOut.classList, aOut);
						fOut.addEventListener('animationend', () => {
							removeAll(fOut.classList, aOut);
							fOut.style.display = 'none';
							hideMessages();
						}, { once : true, capture: true });
					}
				}
			};

			if (skipAnimation) {
				update();
			} else {
				addOnce(cb.classList, 'controlbar-out');
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

		let bigTimer = [];
		const clearBigTimer = (id) => {
			const t = bigTimer[id];
			clearTimeout(bigTimer[id]);
			bigTimer[id] = null;
			return t && t !== -1;
		};

		const showBigButton = (id, delay) => {
			clearBigTimer(id);
			const b = document.getElementById(id)
			const show = () => {
				removeAll(b.classList, 'big-button-out');
				removeAll(b.classList, 'big-button-hide');
				addOnce(b.classList, 'big-button-in');
				b.disabled = false;
			};
			if (delay) {
				bigTimer[id] = setTimeout(show, delay);
			} else {
				bigTimer[id] = -1;
				show();
			}
			return b;
		};

		const clearBigButton = (id) => {
			clearBigTimer(id);
			const b = typeof id === 'string' ? document.getElementById(id) : id;
			addOnce(b.classList, 'big-button-hide');
			removeAll(b.classList, 'big-button-out');
			removeAll(b.classList, 'big-button-in');
		};

		const hideBigButton = (id) => {
			const b = typeof id === 'string' ? document.getElementById(id) : id;
			const name = b.id;
			if (clearBigTimer(name)) {
				clearBigButton(name);
			} else {
				removeAll(b.classList, 'big-button-in');
				addOnce(b.classList, 'big-button-out');
				b.addEventListener('animationend', () => {
					addOnce(b.classList, 'big-button-hide');
					removeAll(b.classList, 'big-button-out');
				}, { once : true, capture: true });
			}
			b.disabled = true;
			return b;
		};

		const stage111 = () => {
			subStage = 111;
			buttonBar({play: 'active', skip: 'active'});

			const i = document.getElementById('image11');
			i.src = 'bags1-1.png';

			const f = document.getElementById('frame11');
			addOnce(f.classList, 'pointer');

			const b1 = document.getElementById('b_frame1');
			b1.classList.add('active-frame');
		};

		const stage112 = () => {
			subStage = 112;
			buttonBar({pause: 'disable', skip: 'active'});
			const p = document.getElementById('panel11');
			addOnce(p.classList, 'panel-out');
			p.addEventListener('animationend', () => {
				addOnce(p.classList, 'panel-hide');
				const i = document.getElementById('image11');
				i.src = 'bags1-2.png';
				setTimeout(() => {
					addOnce(p.classList, 'panel-in');
					removeAll(p.classList, 'panel-hide');
				}, 0);

				document.documentElement.style.setProperty('--message-height', m111height);
				const m11 = document.getElementById('message111');
				m11.classList.add('show');
				m11.addEventListener('animationend', () => {
					removeAll(p.classList, 'panel-out');
					removeAll(p.classList, 'panel-in');

					const w = document.getElementById('waiting');
					addOnce(w.classList, 'show');

					const button = document.getElementById('addBag');
					addOnce(button.classList, 'display-block');
				}, { once : true, capture: true });
			}, { once : true, capture: true });
		};

		const stage113 = () => {
			subStage = 113;
			buttonBar({pause: 'disable', skip: 'active'});
			const w = document.getElementById('waiting');
			addOnce(w.classList, 'hide');
			w.addEventListener('animationend', () => {
				removeAll(w.classList, 'show');
				removeAll(w.classList, 'hide');

				const i = document.getElementById('image11');
				i.src = 'bags1-3.png';

				document.documentElement.style.setProperty('--message-height', m111height);
				const m111 = document.getElementById('message111');
				m111.classList.add('hide');
				m111.addEventListener('animationend', () => {
					m111.classList.remove('show');
					m111.classList.remove('hide');

					const button = document.getElementById('fillBags');
					addOnce(button.classList, 'display-block');

					document.documentElement.style.setProperty('--message-height', m112height);
					const m112 = document.getElementById('message112');
					m112.classList.add('show');
				}, { once : true, capture: true });
			}, { once : true, capture: true });
		}

		const stage114 = () => {
			subStage = 114;
			buttonBar({pause: 'disable', skip: 'active'});

			const i = document.getElementById('image11');
			i.src = 'bags1-4.png';

			document.documentElement.style.setProperty('--message-height', m112height);
			const m112 = document.getElementById('message112');
			m112.classList.add('hide');
			m112.addEventListener('animationend', () => {
				m112.classList.remove('show');
				m112.classList.remove('hide');

				const bf = document.getElementById('b_frame2');
				addOnce(bf.classList, 'end-frame');
				showBigButton('big-next', 3000);

				document.documentElement.style.setProperty('--message-height', m113height);
				const m113 = document.getElementById('message113');
				m113.classList.add('show');
			}, { once : true, capture: true });
		}

		const stage121 = () => {
			subStage = 121;
			buttonBar({pause: 'disable', skip: 'active'});

			const b2 = document.getElementById('b_frame2');
			b2.classList.add('active-frame');

			const b3 = document.getElementById('b_frame3');
			b3.classList.add('end-frame');

			showBigButton('big-next', 3000);
		}

		const stage131 = () => {
			subStage = 131;
			buttonBar({play: 'active', skip: 'hide'});
			const i = document.getElementById('image13');
			i.src = 'bags3-1.png';

			const f = document.getElementById('frame13');
			addOnce(f.classList, 'pointer');

			const b3 = document.getElementById('b_frame3');
			b3.classList.add('active-frame');
		}

		const stage132 = () => {
			subStage = 132;
			buttonBar({play: 'disable', skip: 'hide'});
			const p = document.getElementById('panel13');
			addOnce(p.classList, 'panel-out');
			p.addEventListener('animationend', () => {
				addOnce(p.classList, 'panel-hide');
				const i = document.getElementById('image13');
				i.src = 'bags3-2.png';
				setTimeout(() => {
					addOnce(p.classList, 'panel-in');
					removeAll(p.classList, 'panel-hide');
				}, 0);

				document.documentElement.style.setProperty('--message-height', m131height);
				const m131 = document.getElementById('message131');
				m131.classList.add('show');
				m131.addEventListener('animationend', () => {
					removeAll(p.classList, 'panel-out');
					removeAll(p.classList, 'panel-in');

					const done = document.getElementById('done');
					addOnce(done.classList, 'display-inline-block');
				}, { once : true, capture: true });
			}, { once : true, capture: true });
		}

		const stage211 = () => {
			console.log('stage211', stage);
			subStage = 211;
			buttonBar({play: 'active', skip: 'active'});

			const i = document.getElementById('image21');
			i.src = 'rise1-1.png';

			const f = document.getElementById('frame21');
			addOnce(f.classList, 'pointer');

			const b1 = document.getElementById('b_frame1');
			b1.classList.add('active-frame');
		};

		const stage212 = () => {
			console.log('stage212', stage);
			subStage = 212;
			buttonBar({pause: 'active', skip: 'active'});
			setTimeout(() => {
				const i = document.getElementById('image21');
				i.src = 'rise1-2.png';
				setTimeout(() => {
					i.src = 'rise1-3.png';

					document.documentElement.style.setProperty('--message-height', m211height);
					const m211 = document.getElementById('message211');
					m211.classList.add('show');

					const bf = document.getElementById('b_frame2');
					addOnce(bf.classList, 'end-frame');

          buttonBar({pause: 'disable', skip: 'active'});
					showBigButton('big-next', 3000);
				}, 500);
			}, 100);
		};

		const stage221 = () => {
			console.log('stage221', stage);
			subStage = 221;
      buttonBar({pause: 'active', skip: 'active'});

			const i = document.getElementById('image22');
			i.src = 'rise1-3.png';

			const f = document.getElementById('frame22');
			addOnce(f.classList, 'pointer');

			const b2 = document.getElementById('b_frame2');
			b2.classList.add('active-frame');

			setTimeout(() => {
				i.src = 'rise2-1.png';
				setTimeout(() => {
					i.src = 'rise2-2.png';
					setTimeout(() => {
						i.src = 'rise2-3.png';

						document.documentElement.style.setProperty('--message-height', m221height);
						const m221 = document.getElementById('message221');
						m221.classList.add('show');

						const b3 = document.getElementById('b_frame3');
						b3.classList.add('end-frame');

            buttonBar({pause: 'disable', skip: 'active'});
						showBigButton('big-next', 3000);
					}, 300);
				}, 300);
			}, 1500);
		};

		const stage231 = () => {
			console.log('stage231', stage);
			subStage = 231;
      buttonBar({pause: 'active', skip: 'active'});

			const i = document.getElementById('image23');
			i.src = 'rise2-3.png';

			const f = document.getElementById('frame23');
			addOnce(f.classList, 'pointer');

			const b3 = document.getElementById('b_frame3');
			b3.classList.add('active-frame');

			setTimeout(() => {
				i.src = 'rise1-3.png';
				setTimeout(() => {
					i.src = 'rise3-1.png';
					setTimeout(() => {
						i.src = 'rise3-2.png';
						setTimeout(() => {
							i.src = 'rise3-3.png';
							setTimeout(() => {
								i.src = 'rise3-4.png';

								document.documentElement.style.setProperty('--message-height', m231height);
								const m231 = document.getElementById('message231');
								m231.classList.add('show');

								const b4 = document.getElementById('b_frame4');
								b4.classList.add('end-frame');

                buttonBar({pause: 'disable', skip: 'active'});
								showBigButton('big-next', 3000);
							}, 300);
						}, 300);
					}, 300);
				}, 300);
			}, 1500);
		};

    const stage241 = () => {
      console.log('stage241', stage);
      subStage = 241;
      buttonBar({pause: 'active', skip: 'active'});

      const i = document.getElementById('image24');
      i.src = 'rise3-4.png';

      const f = document.getElementById('frame24');
      addOnce(f.classList, 'pointer');

      const b4 = document.getElementById('b_frame4');
      b4.classList.add('active-frame');

      setTimeout(() => {
        i.src = 'rise4-1.png';
        setTimeout(() => {
          i.src = 'rise4-2.png';
          setTimeout(() => {
            i.src = 'rise4-3.png';
            setTimeout(() => {
              i.src = 'rise4-4.png';

              document.documentElement.style.setProperty('--message-height', m241height);
              const m241 = document.getElementById('message241');
              m241.classList.add('show');

              buttonBar({play: 'disable', skip: 'hide'});
              const done = document.getElementById('done');
              addOnce(done.classList, 'display-inline-block');
            }, 300);
          }, 300);
        }, 300);
      }, 1500);
    };

		const addBag = () => {
			const button = document.getElementById('addBag');
			removeAll(button.classList, 'display-block');
			stage113();
		}

		const fillBags = () => {
			const button = document.getElementById('fillBags');
			removeAll(button.classList, 'display-block');
			stage114();
		}

		let stage = 11;
		let subStage = 111;
		const jumpToStage = (s, force) => {
			if (s < 10) {
				// circular numbered panel button was pressed; change to proper stage number
				s = Math.floor(stage / 10) * 10 + s;
			}
			if (s === stage && !force) {
				return;
			}
			console.log('jump', stage, s);

			// reset all classes
			const f11 = document.getElementById('frame11');
			f11.classList.remove('pointer');
			const f13 = document.getElementById('frame13');
			f13.classList.remove('pointer');
			const f21 = document.getElementById('frame21');
			f21.classList.remove('pointer');
			const f22 = document.getElementById('frame22');
			f22.classList.remove('pointer');
			const f23 = document.getElementById('frame23');
			f23.classList.remove('pointer');
      const f24 = document.getElementById('frame24');
      f24.classList.remove('pointer');

			const w = document.getElementById('waiting');
			removeAll(w.classList, 'show');

			clearBigButton('big-play');
			clearBigButton('big-next');

			const p11 = document.getElementById('panel11');
			p11.classList.remove('panel-out');
			p11.classList.remove('panel-in');
			const p12 = document.getElementById('panel12');
			p12.classList.remove('panel-out');
			p12.classList.remove('panel-in');
			const p13 = document.getElementById('panel13');
			p13.classList.remove('panel-out');
			p13.classList.remove('panel-in');
			const p21 = document.getElementById('panel21');
			p21.classList.remove('panel-out');
			p21.classList.remove('panel-in');
			const p22 = document.getElementById('panel22');
			p22.classList.remove('panel-out');
			p22.classList.remove('panel-in');
			const p23 = document.getElementById('panel23');
			p23.classList.remove('panel-out');
			p23.classList.remove('panel-in');
      const p24 = document.getElementById('panel24');
      p24.classList.remove('panel-out');
      p24.classList.remove('panel-in');

			const bAdd = document.getElementById('addBag');
			removeAll(bAdd.classList, 'display-block');
			const bFill = document.getElementById('fillBags');
			removeAll(bFill.classList, 'display-block');

			const done = document.getElementById('done');
			removeAll(done.classList, 'display-inline-block');

			showStage(s, force);
			stage = s;
		}

		const nextStage = (fade) => {
			const jump = () => {
				const max = stage % 10 === 1 ? 3 : 4;
				const s = (stage % 10) % max + 1;
				console.log('next', stage, max, s);
				jumpToStage(s);
			}

			if (fade) {
				const b = document.getElementById('big-next')
				removeAll(b.classList, 'big-button-in');
				addOnce(b.classList, 'big-button-out');
				b.addEventListener('animationend', () => {
					clearBigButton(b);
					jump();
				}, { once : true, capture: true });
			} else {
				jump();
			}
		}

		const resetStage = () => {
			jumpToStage(Math.floor(stage / 10) * 10 + 1, true);
		};

		const play = () => {
			let fName, sName;
			switch (subStage) {
				case 111:
					fName = 'frame11';
					sName = stage112;
					break;

				case 131:
					fName = 'frame13';
					sName = stage132;
					break;

				case 211:
					fName = 'frame21';
					sName = stage212;
					break;

				default:
					return;
			}
			console.log('play', subStage, fName);

			const b = hideBigButton('big-play');
			//!! hack
			const x = setTimeout(() => {
				console.log('hack firing', fName);
				b.removeEventListener('animationend', doit, { once : true, capture: true });
				doit();
			}, 1100);
			const doit = () => {
				console.log('doit', fName);
				clearTimeout(x);
				const f = document.getElementById(fName);
				removeAll(f.classList, 'pointer');
				setTimeout(() => {
					sName();
				}, 0);
			};
			b.addEventListener('animationend', doit, { once : true, capture: true });
		};

		let m111height, m112height, m113height, m131height, m211height, m221height, m231height, m241height;
		const getHeight = (id) => {
			const m = document.getElementById(id);
			const h = `${m.clientHeight}px`;
			// console.log(id, h);
			removeAll(m.classList, 'loading');
			return h;
		}

		const updateBreak = (choose) => {
			const parent = document.getElementById('break');
			parent.style.display = 'none';
		  const breaks = ['none', 'hr', 'orange', 'icon-title', 'whitespace'];
			for (const id of breaks) {
				const b = document.getElementById(id);
				b.style.display = choose === id ? 'block' : 'none';
			}
			parent.style.display = 'block';
		};

		let transitionType = 'push';
		const updateTransition = (choose) => {
			transitionType = choose;
		}

		const updateMockup = (choose) => {
			const ids1Block = ['intro1', 'mimic1'];
			const ids2Block = ['intro2', 'mimic2'];
			const ids1Grid = ['frameset1'];
			const ids2Grid = ['frameset2'];
      const ids1Inline = ['title1'];
      const ids2Inline = ['title2'];
			for (const id of Array.from(new Set([...ids1Block, ...ids2Block, ...ids1Grid, ...ids2Grid, ...ids1Inline, ...ids2Inline]))) {
				const e = document.getElementById(id);
				e.style.display = 'none';
			}
			const idsShow = [
				'message111', 'message112', 'message113', 'message131', 'message211', 'message221', 'message231', 'message241'
			];
			for (const id of idsShow) {
				const e = document.getElementById(id);
				removeAll(e.classList, 'show');
			}

			const w = document.getElementById('waiting');
			removeAll(w.classList, 'show');

			switch (choose) {
				case 'rise':
					for (const id of ids2Block) {
						const e = document.getElementById(id);
						e.style.display = 'block';
					}
					for (const id of ids2Grid) {
						const e = document.getElementById(id);
						e.style.display = 'grid';
					}
          for (const id of ids2Inline) {
            const e = document.getElementById(id);
            e.style.display = 'inline';
          }
					removeAll(document.getElementById('b_frame4').classList, 'display-off');
					jumpToStage(21, true);
					break;

				default:
					console.error(`unknown mockup: ${choose}`);
					// fall-through

				case 'glow':
					for (const id of ids1Block) {
						const e = document.getElementById(id);
						e.style.display = 'block';
					}
					for (const id of ids1Grid) {
						const e = document.getElementById(id);
						e.style.display = 'grid';
					}
          for (const id of ids1Inline) {
            const e = document.getElementById(id);
            e.style.display = 'inline';
          }
					addOnce(document.getElementById('b_frame4').classList, 'display-off');
					jumpToStage(11, true);
					break;
			}
		}

		const init = () => {
			// find the heights of various things while they are rendered but invisible
			m111height = getHeight('message111');
			m112height = getHeight('message112');
			m113height = getHeight('message113');
			m131height = getHeight('message131');
			m211height = getHeight('message211');
			m221height = getHeight('message221');
			m231height = getHeight('message231');
      m241height = getHeight('message241');

			document.documentElement.style.setProperty('--message-height', m111height);

			const w = document.getElementById('waiting');
			document.documentElement.style.setProperty('--waiting-height', `${w.clientHeight}px`);
			removeAll(w.classList, 'loading');

			const f12 = document.getElementById('frame12');
			f12.style.display = 'none';
			const f13 = document.getElementById('frame13');
			f13.style.display = 'none';
			const f22 = document.getElementById('frame22');
			f22.style.display = 'none';
			const f23 = document.getElementById('frame23');
			f23.style.display = 'none';
      const f24 = document.getElementById('frame24');
      f24.style.display = 'none';

			const fs2 = document.getElementById('frameset2');
			fs2.style.display = 'none';

			addOnce(document.getElementById('b_frame4').classList, 'display-off');

			const a = document.getElementById('animation');
			removeAll(a.classList, 'loading');

			showStage(11, true);
			showBigButton('big-play');

			bumpSpeed();
			updateBreak('none');

			// hack for fancy-underline on done message
			const blink = () => {
				// scrollUp();
				const done = document.getElementById('done');
				addOnce(done.classList, 'active');
				setTimeout(() => {
					removeAll(done.classList, 'active');
					setTimeout(() => {
						blink();
					}, 500);
				}, 1750);
			};
			setTimeout(blink, 0);
		};
