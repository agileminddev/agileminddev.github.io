
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

		const idsShow = [
			'message111', 'message112', 'message113', 'message131',
			'message211', 'message221', 'message231', 'message241',
			'message331', 'message341', 'message351',
		];
		const hideMessages = () => {
			for (const id of idsShow) {
				const e = document.getElementById(id);
				removeAll(e.classList, 'show');
			}
		};

		const bFrames = [
			'b_frame1', 'b_frame2', 'b_frame3', 'b_frame4', 'b_frame5',
		];
		const resetBFrames = () => {
			for (const id of bFrames) {
				const e = document.getElementById(id);
				removeAll(e.classList, 'active-frame');
				removeAll(e.classList, 'end-frame');
			}
		};

		const frameIds = [
			'frame11', 'frame12', 'frame13',
			'frame21', 'frame22', 'frame23', 'frame24',
			'frame31', 'frame32', 'frame33', 'frame34', 'frame35'
		];
		const resetFrames = () => {
			for (const id of frameIds) {
				const e = document.getElementById(id);
				removeAll(e.classList, 'pointer');
			}
		}

		const panelIds = [
			'panel11', 'panel12', 'panel13',
			'panel21', 'panel22', 'panel23', 'panel24',
			'panel31', 'panel32', 'panel33', 'panel34', 'panel35'
		];
		const resetPanels = () => {
			for (const id of panelIds) {
				const e = document.getElementById(id);
				removeAll(e.classList, 'panel-out');
				removeAll(e.classList, 'panel-in');
			}
		}

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
			const fIn = document.getElementById(`frame${s}`);
			const fOut = document.getElementById(`frame${stage}`);
			const cb = document.getElementById('controlbar');
			const showPlay = s === 1 || s === 3 || s === 21;

			if (!skipAnimation) {
				fIn.style['z-index'] = '10';
				fOut.style['z-index'] = '1';
			}

			const update = () => {
				// reset frame buttons
				resetBFrames();

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

		// build a list of images and times as a param to playImages()
		const buildControl = (stub, count, delay) => {
			const control = [];
			const dArray = delay || [];
			for (let i = 0; i < count; i++) {
				const img = `${stub}${i + 1}.png`;
				const d = i < dArray.length ? dArray[i] : undefined;
				control.push({
					img: img,
					...(d && {delay: d})
				});
			}
			return control;
		};

		let playing = [];
		const cancelPlay = () => {
			while (playing.length > 0) {
				const t = playing.pop();
				clearTimeout(t);
			}
		};

		// control == [{img: name, delay: ms}]
		const playImages = (image, control, last) => {
			let lastDelay = 0;
			let totalDelay = 0;
			for (const [i, id] of control.entries()) {
				const img = id.img;
				const delay = id.delay || lastDelay;
				lastDelay = delay;
				totalDelay += delay;
				const lastIter = i === control.length - 1;

				if (delay >= 0) {
					const t = setTimeout(() => {
						image.src = img;
						if (lastIter) {
							last();
						}
					}, totalDelay);
					playing.push(t);
				}
			}
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
			subStage = 212;
			buttonBar({pause: 'active', skip: 'active'});

			playImages(
				document.getElementById('image21'),
				buildControl('rise1-', 3, [-1, 100, 500]),
				() => {
					document.documentElement.style.setProperty('--message-height', m211height);
					const m211 = document.getElementById('message211');
					m211.classList.add('show');

					const bf = document.getElementById('b_frame2');
					addOnce(bf.classList, 'end-frame');

					buttonBar({pause: 'disable', skip: 'active'});
					showBigButton('big-next', 3000);
				}
			);
		};

		const stage221 = () => {
			subStage = 221;
      buttonBar({pause: 'active', skip: 'active'});

			const i = document.getElementById('image22');
			i.src = 'rise1-3.png';

			const b2 = document.getElementById('b_frame2');
			b2.classList.add('active-frame');

			playImages(
				i,
				buildControl('rise2-', 3, [1500, 300]),
				() => {
					document.documentElement.style.setProperty('--message-height', m221height);
					const m221 = document.getElementById('message221');
					m221.classList.add('show');

					const b3 = document.getElementById('b_frame3');
					b3.classList.add('end-frame');

					buttonBar({pause: 'disable', skip: 'active'});
					showBigButton('big-next', 3000);
				}
			);
		};

		const stage231 = () => {
			subStage = 231;
      buttonBar({pause: 'active', skip: 'active'});

			const i = document.getElementById('image23');
			i.src = 'rise2-3.png';

			const f = document.getElementById('frame23');
			addOnce(f.classList, 'pointer');

			const b3 = document.getElementById('b_frame3');
			b3.classList.add('active-frame');

			playImages(
				i,
				buildControl('rise3-', 5, [1500, 300]),
				() => {
					document.documentElement.style.setProperty('--message-height', m231height);
					const m231 = document.getElementById('message231');
					m231.classList.add('show');

					const b4 = document.getElementById('b_frame4');
					b4.classList.add('end-frame');

					buttonBar({pause: 'disable', skip: 'active'});
					showBigButton('big-next', 3000);
				}
			);
		};

    const stage241 = () => {
      subStage = 241;
      buttonBar({pause: 'active', skip: 'active'});

      const i = document.getElementById('image24');
      i.src = 'rise3-4.png';

      const f = document.getElementById('frame24');
      addOnce(f.classList, 'pointer');

      const b4 = document.getElementById('b_frame4');
      b4.classList.add('active-frame');

			playImages(
				i,
				buildControl('rise4-', 4, [1500, 300]),
				() => {
					document.documentElement.style.setProperty('--message-height', m241height);
					const m241 = document.getElementById('message241');
					m241.classList.add('show');

					buttonBar({play: 'disable', skip: 'hide'});
					const done = document.getElementById('done');
					addOnce(done.classList, 'display-inline-block');
				}
			);
    };

		const stage311 = () => {
			subStage = 311;
			buttonBar({play: 'active', skip: 'active'});

			const i = document.getElementById('image31');
			i.src = 'dist1-1.png';

			const f = document.getElementById('frame31');
			addOnce(f.classList, 'pointer');

			const b1 = document.getElementById('b_frame1');
			b1.classList.add('active-frame');
		};

		const stage312 = () => {
			subStage = 312;
			buttonBar({pause: 'active', skip: 'active'});

			playImages(
				document.getElementById('image31'),
				buildControl('dist1-', 20, [-1, 300]),
				() => {
					const bf = document.getElementById('b_frame2');
					addOnce(bf.classList, 'end-frame');

					buttonBar({pause: 'disable', skip: 'active'});
					showBigButton('big-next', 3000);
				}
			);
		};

		const stage321 = () => {
			subStage = 321;
			buttonBar({play: 'active', skip: 'active'});

			const i = document.getElementById('image32');
			i.src = 'dist1-20.png';

			const f = document.getElementById('frame32');
			addOnce(f.classList, 'pointer');

			const b2 = document.getElementById('b_frame2');
			b2.classList.add('active-frame');
		};

		const stage322 = () => {
			subStage = 322;
			buttonBar({pause: 'active', skip: 'active'});

			playImages(
				document.getElementById('image32'),
				buildControl('dist2-', 6, [300]),
				() => {
					const bf = document.getElementById('b_frame3');
					addOnce(bf.classList, 'end-frame');

					buttonBar({pause: 'disable', skip: 'active'});
					showBigButton('big-next', 3000);
				}
			);
		};

		const stage331 = () => {
			subStage = 331;
			buttonBar({pause: 'active', skip: 'active'});

			const b3 = document.getElementById('b_frame3');
			b3.classList.add('active-frame');

			playImages(
				document.getElementById('image33'),
				buildControl('dist3-', 15, [1000, 300]),
				() => {
					document.documentElement.style.setProperty('--message-height', m331height);
					const m331 = document.getElementById('message331');
					m331.classList.add('show');

					const bf = document.getElementById('b_frame4');
					addOnce(bf.classList, 'end-frame');

					buttonBar({pause: 'disable', skip: 'active'});
					showBigButton('big-next', 3000);
				}
			);
		};

    const stage341 = () => {
      subStage = 341;
      buttonBar({play: 'active', skip: 'active'});

      const i = document.getElementById('image34');
      i.src = 'dist4-1.png';

      const f = document.getElementById('frame34');
      addOnce(f.classList, 'pointer');

      const b4 = document.getElementById('b_frame4');
      b4.classList.add('active-frame');
    };

    const stage342 = () => {
      subStage = 342;
      buttonBar({pause: 'active', skip: 'active'});

      playImages(
        document.getElementById('image34'),
        buildControl('dist4-', 7, [0, 300]),
        () => {
					document.documentElement.style.setProperty('--message-height', m341height);
					const m341 = document.getElementById('message341');
					m341.classList.add('show');

					const bf = document.getElementById('b_frame5');
          addOnce(bf.classList, 'end-frame');

          buttonBar({pause: 'disable', skip: 'active'});
          showBigButton('big-next', 3000);
        }
      );
    };

    const stage351 = () => {
			subStage = 351;
			buttonBar({pause: 'active', skip: 'active'});

			const i = document.getElementById('image35');
			i.src = 'dist4-7.png';

			const b5 = document.getElementById('b_frame5');
			b5.classList.add('active-frame');

			playImages(
				i,
				buildControl('dist5-', 36, [300]),
				() => {
					document.documentElement.style.setProperty('--message-height', m351height);
					const m351 = document.getElementById('message351');
					m351.classList.add('show');

					buttonBar({play: 'disable', skip: 'hide'});
					const done = document.getElementById('done');
					addOnce(done.classList, 'display-inline-block');
				}
			);
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

			// reset all classes
			cancelPlay();
			resetFrames();
			resetPanels();

			const w = document.getElementById('waiting');
			removeAll(w.classList, 'show');

			clearBigButton('big-play');
			clearBigButton('big-next');

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
				const s = (stage % 10) % maxFrames + 1;
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

				case 311:
					fName = 'frame31';
					sName = stage312;
					break;

				case 321:
					fName = 'frame32';
					sName = stage322;
					break;

        case 341:
          fName = 'frame34';
          sName = stage342;
          break;

        default:
					return;
			}

			const b = hideBigButton('big-play');
			//!! hack
			const x = setTimeout(() => {
				b.removeEventListener('animationend', doit, { once : true, capture: true });
				doit();
			}, 1100);
			const doit = () => {
				clearTimeout(x);
				const f = document.getElementById(fName);
				removeAll(f.classList, 'pointer');
				setTimeout(() => {
					sName();
				}, 0);
			};
			b.addEventListener('animationend', doit, { once : true, capture: true });
		};

		let m111height, m112height, m113height, m131height,
			m211height, m221height, m231height, m241height,
			m331height, m341height, m351height;
		const getHeight = (id) => {
			const m = document.getElementById(id);
			const h = `${m.clientHeight}px`;
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

		let transitionType = 'wipe';
		const updateTransition = (choose) => {
			transitionType = choose;
		}

		let maxFrames = 3;
		const updateMockup = (choose) => {
			const ids1Block = ['intro1', 'mimic1'];
			const ids2Block = ['intro2', 'mimic2'];
			const ids3Block = ['intro3', 'mimic3'];
			const ids1Grid = ['frameset1'];
			const ids2Grid = ['frameset2'];
			const ids3Grid = ['frameset3'];
      const ids1Inline = ['title1'];
      const ids2Inline = ['title2'];
			const ids3Inline = ['title3'];
			for (const id of Array.from(new Set([
				...ids1Block, ...ids2Block, ...ids3Block,
				...ids1Grid, ...ids2Grid, ...ids3Grid,
				...ids1Inline, ...ids2Inline, ...ids3Inline
			]))) {
				const e = document.getElementById(id);
				if (!e) {
					console.error(`${id} not found`)
				}
				e.style.display = 'none';
			}
			hideMessages();
			cancelPlay();

			const w = document.getElementById('waiting');
			removeAll(w.classList, 'show');

			switch (choose) {
				case 'dist':
					maxFrames = 5;
					for (const id of ids3Block) {
						const e = document.getElementById(id);
						e.style.display = 'block';
					}
					for (const id of ids3Grid) {
						const e = document.getElementById(id);
						e.style.display = 'grid';
					}
					for (const id of ids3Inline) {
						const e = document.getElementById(id);
						e.style.display = 'inline';
					}
					removeAll(document.getElementById('b_frame4').classList, 'display-off');
					removeAll(document.getElementById('b_frame5').classList, 'display-off');
					jumpToStage(31, true);
					break;

				case 'rise':
					maxFrames = 4;
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
					addOnce(document.getElementById('b_frame5').classList, 'display-off');
					jumpToStage(21, true);
					break;

				default:
					console.error(`unknown mockup: ${choose}`);
					// fall-through

				case 'glow':
					maxFrames = 3;
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
					addOnce(document.getElementById('b_frame5').classList, 'display-off');
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
			m331height = getHeight('message331');
			m341height = getHeight('message341');
			m351height = getHeight('message351');

			document.documentElement.style.setProperty('--message-height', m111height);

			const w = document.getElementById('waiting');
			document.documentElement.style.setProperty('--waiting-height', `${w.clientHeight}px`);
			removeAll(w.classList, 'loading');

			for (const id of frameIds) {
				// wtf? why skip 1?
				if (id.at(-1) !== '1') {
					const e = document.getElementById(id);
					e.style.display = 'none';
				}
			}

			const fs2 = document.getElementById('frameset2');
			fs2.style.display = 'none';
			const fs3 = document.getElementById('frameset3');
			fs3.style.display = 'none';

			addOnce(document.getElementById('b_frame4').classList, 'display-off');
			addOnce(document.getElementById('b_frame5').classList, 'display-off');

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
