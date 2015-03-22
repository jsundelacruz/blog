;
(function($) {
	var h = $.scrollTo = function(a, b, c) {
		$(window).scrollTo(a, b, c)
	};
	h.defaults = {
		axis: 'xy',
		duration: parseFloat($.fn.jquery) >= 1.3 ? 0 : 1,
		limit: true
	};
	h.window = function(a) {
		return $(window)._scrollable()
	};
	$.fn._scrollable = function() {
		return this.map(function() {
			var a = this,
				isWin = !a.nodeName || $.inArray(a.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1;
			if (!isWin) return a;
			var b = (a.contentWindow || a).document || a.ownerDocument || a;
			return /webkit/i.test(navigator.userAgent) || b.compatMode == 'BackCompat' ? b.body : b.documentElement
		})
	};
	$.fn.scrollTo = function(e, f, g) {
		if (typeof f == 'object') {
			g = f;
			f = 0
		}
		if (typeof g == 'function') g = {
			onAfter: g
		};
		if (e == 'max') e = 9e9;
		g = $.extend({}, h.defaults, g);
		f = f || g.duration;
		g.queue = g.queue && g.axis.length > 1;
		if (g.queue) f /= 2;
		g.offset = both(g.offset);
		g.over = both(g.over);
		return this._scrollable().each(function() {
			if (e == null) return;
			var d = this,
				$elem = $(d),
				targ = e,
				toff, attr = {}, win = $elem.is('html,body');
			switch (typeof targ) {
				case 'number':
				case 'string':
					if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
						targ = both(targ);
						break
					}
					targ = $(targ, this);
					if (!targ.length) return;
				case 'object':
					if (targ.is || targ.style) toff = (targ = $(targ)).offset()
			}
			$.each(g.axis.split(''), function(i, a) {
				var b = a == 'x' ? 'Left' : 'Top',
					pos = b.toLowerCase(),
					key = 'scroll' + b,
					old = d[key],
					max = h.max(d, a);
				if (toff) {
					attr[key] = toff[pos] + (win ? 0 : old - $elem.offset()[pos]);
					if (g.margin) {
						attr[key] -= parseInt(targ.css('margin' + b)) || 0;
						attr[key] -= parseInt(targ.css('border' + b + 'Width')) || 0
					}
					attr[key] += g.offset[pos] || 0;
					if (g.over[pos]) attr[key] += targ[a == 'x' ? 'width' : 'height']() * g.over[pos]
				} else {
					var c = targ[pos];
					attr[key] = c.slice && c.slice(-1) == '%' ? parseFloat(c) / 100 * max : c
				} if (g.limit && /^\d+$/.test(attr[key])) attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max);
				if (!i && g.queue) {
					if (old != attr[key]) animate(g.onAfterFirst);
					delete attr[key]
				}
			});
			animate(g.onAfter);

			function animate(a) {
				$elem.animate(attr, f, g.easing, a && function() {
					a.call(this, e, g)
				})
			}
		}).end()
	};
	h.max = function(a, b) {
		var c = b == 'x' ? 'Width' : 'Height',
			scroll = 'scroll' + c;
		if (!$(a).is('html,body')) return a[scroll] - $(a)[c.toLowerCase()]();
		var d = 'client' + c,
			html = a.ownerDocument.documentElement,
			body = a.ownerDocument.body;
		return Math.max(html[scroll], body[scroll]) - Math.min(html[d], body[d])
	};

	function both(a) {
		return typeof a == 'object' ? a : {
			top: a,
			left: a
		}
	}
})(jQuery);

(function() {

	var ie = (function() {

		var undef,
			v = 3,
			div = document.createElement('div'),
			all = div.getElementsByTagName('i');

		while (
			div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
			all[0]
		)
		;

		return v > 4 ? v : undef;

	})();

	$.fn.menuItems = function(opt) {
		/* 			console.log($(this)); */
		$(this).each(function() {
			/* 				console.log($(this)); */
			var getDataAttr = function(element) {
				var data_option = {};
				//        var keys = Object.keys(option);
				$.each(option, function(i, val) {
					if (typeof element.attr('data-mi-' + [i]) !== "undefined" && typeof element.attr('data-mi-' + [i]) !== false) {
						try {
							data_option[[i]] = $.parseJSON(element.attr('data-mi-' + [i]));
							return true; //continue;
						} catch (e) {}
						if (typeof data_option[i] !== "object") {
							data_option[[i]] = element.attr('data-mi-' + [i]);
						}
					}
				});

				var data_json = (typeof element.attr('data-mi') !== "undefined" && typeof element.attr('data-mi') !== false ? $.parseJSON(element.attr('data-mi')) : []);

				$.extend(true, data_option, data_json);

				if (ie < 9) {
					$.each(data_option, function(i, val) {
						//                console.log(data_option[i]);
						if (typeof rgbaToRgb(data_option[i]) !== "undefined") {
							data_option[i] = rgbaToRgb(data_option[i]);
						}
						if (typeof rgbaToRgb(data_option[i]) !== "undefined") {
							data_option[i] = rgbaToRgb(data_option[i]);
						}
					});
				}

				return data_option;
			};

			var rgbaToRgb = function(rgba) {
				try {
					var bits = rgba.split("(");
				} catch (e) {
					return;
				}
				if (typeof bits[1] !== "undefined") {
					//            console.log('splitting');
					bits = bits[1].split(")")[0].split(",");

					return "rgb(" + bits[0] + "," + bits[1] + "," + bits[2] + ")";
				}
				return;
			};

			var self = $(this);
			self.addClass('mi-container');
			var item_container = $('<div class="menuItems"></div>').appendTo(self);

			var menuItems = [];
			var isBody = self.is('body') || (self.outerHeight() >= $(document).height() && self.outerWidth() >= $(document).width());


			var default_option = {
				items: [],
				display: 'block',
				listContainerAnimationSpeed: "500ms",
				textHoverSpeed: "1000ms",
				onActivateSpeed: "1000ms",
				color: "#ecf0f1",
				changeUrl: true,
				activeBorderColor: "",
				inactiveBorderColor: "",
				borderColor: "#E5E1D1",
				borderWidth: 1,
				activeFill: "#E5E1D1",
				activePadding: "5px",
				inactiveFill: "rgba(255, 255, 255, 0)",
				inactivePadding: "3px",
				fontWeight: "normal",
				showTextOnActive: true,
				bounceButton: true,
				themes: {
					mobile: {
						display: 'none'
					}
				},
				theme: null,
				screenSizes: [{
					maxHeight: 99999,
					minHeight: 0,
					maxWidth: 99999,
					minWidth: 800,
					theme: 'default'
				}, {
					maxHeight: 99999,
					minHeight: 0,
					maxWidth: 799,
					minWidth: 0,
					theme: 'mobile'
				}],
				position: 'right',
				offsetTop: 0,
				onAfterScroll: function(el) {},
				stick: true,
				hierarchical: true
			};
			var option = $.extend(true, default_option, opt);
			var theme_option = {};
			var size_option = {};

			var scroll = function() {
				var final_option = $.extend(true, {}, option, size_option);
				//                console.log(final_option);
				var cur_tab;
				var scrollTop = $(window).scrollTop();

				for (var i = 0; i < menuItems.length; i++) {
					if (scrollTop > menuItems[i].offset().top - final_option.offsetTop - ($(window).height() / 2) + (item_container.height())) {
						cur_tab = i;
					}
				}


				if (cur_tab !== prev_tab) {
					prev_tab = cur_tab;
					var el_title = item_container.children('.item:eq(' + cur_tab + ')').attr('data-mi-scrollTo');
					if (history.replaceState && typeof el_title != "undefined") {
						history.replaceState(null, null, '#!' + el_title);
					}
					item_container.children('.item:eq(' + cur_tab + ')').addClass('active').siblings().removeClass('active');
				}

				if (item_container.hasClass('mi-fixed') == false) {
					var windowOffset = $(window).height() / 2;
					var elementOffset = self.offset().top;
					var lastElementBottom = menuItems[menuItems.length - 1].offset().top + menuItems[menuItems.length - 1].height() - elementOffset;
					var firstElementTop = menuItems[0].offset().top - elementOffset;

					var absolute = scrollTop - elementOffset + windowOffset;
					if (absolute + item_container.height() > lastElementBottom) {
						absolute = lastElementBottom - item_container.height();
					} else if (absolute < firstElementTop) {
						absolute = firstElementTop;
					}
					//                    console.log(absolute);
					//                    console.log(firstElementTop);
					//                    console.log(lastElementBottom);
					item_container.css('top', absolute);
				}

				item_container.children('.item').each(function(i) {
					var theme_option = {};
					var item_offset = item_container.children('.item:eq(' + i + ')').offset().top;

					if (item_container.hasClass('mi-fixed')) {
						var box_data_option = getDataAttr(menuItems[cur_tab]);
						theme_option = final_option.themes[box_data_option.theme];
					} else {
						$('[data-mi-theme]').each(function(u) {
							var section_offset = $(this).offset().top;
							for (var z = 0; z < menuItems.length; z++) {
								if ((section_offset < item_offset) && (section_offset + $(this).height() > item_offset)) {
									var box_data_option = getDataAttr($(this));
									theme_option = final_option.themes[box_data_option.theme];
								}
							}
						});
					}
					var box_option = $.extend(true, {}, final_option, theme_option);
					var box_data_option = getDataAttr(menuItems[i]);
					$.extend(true, box_option, box_data_option);


					$(this).css({
						'display': box_option.display,
						'color': box_option.color,
						'fontWeight': box_option.fontWeight
					});
					$(this).find('.circle').css('border', box_option.borderWidth + "px solid " + box_option.borderColor);
					if ($(this).hasClass('active')) {
						if (box_option.activeBorderColor !== "") {
							$(this).find('.circle').css('border', box_option.borderWidth + "px solid " + box_option.activeBorderColor);
						}
					} else {
						if (box_option.inactiveBorderColor !== "") {
							$(this).find('.circle').css('border', box_option.borderWidth + "px solid " + box_option.inactiveBorderColor);
						}
					}
					$(this).find('.circle').css('background', ($(this).hasClass('active') ? box_option.activeFill : box_option.inactiveFill));
					$(this).find('.circle').css('padding', ($(this).hasClass('active') ? box_option.activePadding : box_option.inactivePadding));
				});
			};

			var resize = function() {
				if (item_container.hasClass('mi-fixed')) {
					item_container.css('margin-top', -(item_container.outerHeight(true) / 2));
				}
				for (var i = 0; i < option.screenSizes.length; i++) {
					if (($(window).height() < option.screenSizes[i].maxHeight && $(window).height() > option.screenSizes[i].minHeight) && ($(window).width() < option.screenSizes[i].maxWidth && $(window).width() > option.screenSizes[i].minWidth)) {
						if (option.screenSizes[i].theme !== "default") {
							size_option = $.extend(true, {}, option, option.themes[option.screenSizes[i].theme]);

						} else {
							size_option = {};
						}
						//                        console.log('ScreenSize caused theme: ' + option.screenSizes[i].theme);
					}
				}

				scroll();
			};

			var funcs = {
				update: function(opt) {
					opt = (typeof opt !== "undefined" ? opt : {});
					option = $.extend(true, default_option, opt);

					var final_option = $.extend(true, {}, option, size_option);

					menuItems = [];
					item_container.empty();

					self.find('.menuItem').each(function() {
						if ($(this).parents('.mi-container').first().is(self)) {
							menuItems.push($(this));
						}
					});

					item_container.css('transition', "all " + final_option.listContainerAnimationSpeed);
					item_container.css('-webkit-transition', "all " + final_option.listContainerAnimationSpeed);
					item_container.css('-moz-transition', "all " + final_option.listContainerAnimationSpeed);

					if (final_option.hierarchical === true && isBody === false) {
						item_container.addClass('mi-absolute').removeClass('mi-fixed');
					} else {
						item_container.addClass('mi-fixed').removeClass('mi-absolute');
					}

					var pos = ['left', 'right', 'top-center', 'right', 'bottom-center'];
					for (var i = 0; i < pos.length; i++) {
						item_container.removeClass('mi-position_' + pos[i]);
					}
					item_container.addClass('mi-position_' + final_option.position);

					for (var i = 0; i < menuItems.length; i++) {
						item_container.append($("<div class='item' data-mi-scrollTo='" + menuItems[i].attr('id') + "'><div class='circle'></div><span>" + menuItems[i].data('mi-title') + "</span></div>"));
					}

					item_container.children('.item').each(function(i) {
						var box_option = $.extend(true, {}, final_option);
						var box_data_option = getDataAttr(menuItems[i]);
						$.extend(true, box_option, box_data_option);

						$(this).find('span').css('animation-duration', box_option.textHoverSpeed);
						$(this).find('span').css('-webkit-animation-duration', box_option.textHoverSpeed);
						$(this).find('span').css('-moz-animation-duration', box_option.textHoverSpeed);
						if (box_option.showTextOnActive === true) {
							$(this).addClass('mi-showText');
						} else {
							$(this).removeClass('mi-showText');
						}

						if (box_option.bounceButton === true) {
							$(this).addClass('mi-bounceButton');
							$(this).css('animation-duration', box_option.onActivateSpeed);
							$(this).css('-webkit-animation-duration', box_option.onActivateSpeed);
							$(this).css('-moz-animation-duration', box_option.onActivateSpeed);
						} else {
							$(this).removeClass('mi-bounceButton');
						}
					});

					resize();
				}
			};


			$(document).on('click', '[data-mi-scrollTo]', function(e) {
				if (option.changeUrl === true) {
					if (history.pushState) {
						history.pushState(null, null, '#!' + $(this).attr('data-mi-scrollTo'));

					} else {
						window.location.hash = '#!' + $(this).data('mi-scrollTo');
					}
				}
				var element = $(this);
				$('body').removeClass('sidebar_open');
				scrollTo(element.attr('data-mi-scrollTo'));

				e.preventDefault();
				e.stopPropagation();
				return false;
			});

			funcs.update();

			var prev_tab = -1;
			var prev_scroll;
			$(window).on('scroll', function(evt) {
				scroll();
			});

			$(window).on('resize', function() {
				resize();
			});

			var scrollTo = function(element) {
				if ($("#" + element).length) {
					$.scrollTo($("#" + element), 800, {
						onAfter: function() {
							option.onAfterScroll(element);
						},
						offset: -option.offsetTop
					});
				}
			};


		});
	};
	$(function() {
		if (window.location.hash) {
			var e = window.location.hash.substring(2);
			if ($(e).length > 0)
				scrollTo(window.location.hash.substring(2));
		}
		if ($("[data-mi-autoinit]").length > 0) {
			$("[data-mi-autoinit]").parent().menuItems();
		}
	});
})();