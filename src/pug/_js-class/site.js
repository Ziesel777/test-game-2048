import $ from 'jquery';
import Swiper from 'swiper';

class Site {
	constructor() {
		this.widthWindow = $(window).width();
		$(window).resize(function () {
			this.widthWindow = $(window).width();
		});
	}

	/* плавный скрол по якорю.
	 * selector - родительского блока кнопки
	 * time - время прокрутки скролла
	 */
	scrollBTNinID(selector, btn_sel = '.btn', time = 600) {
		let $btn = $(selector).find(btn_sel);

		if ($btn.length > 0) {
			$btn.click(function () {
				$("html, body").animate({
					scrollTop: $($(this).attr("href")).offset().top + "px"
				}, {
					duration: time,
					easing: "swing"
				});
				return false;
			});
		}
	}

	/**
	 * получени ID-видео из URL-Youtube
	 */
	youTubeGetID(url) {
		let ID = '';
		url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
		if (url[2] !== undefined) {
			ID = url[2].split(/[^0-9a-z_\-]/i);
			ID = ID[0];
		} else {
			ID = url;
		}
		return ID;
	}

	/**
	 * @param {селектор контейнер YouTube блока} selBlock
	 * @param {селектор кастомной кнопки play} selBtn
	 */
	youtube(selBlock, selBtn) {
		let img = new Image();
		let $youtube = $(selBlock);

		let $btn,
			url,
			id,
			src_preview;

		if ($youtube.length > 0) {
			$btn = $youtube.find(selBtn);

			url = $youtube.attr('src-youtube');
			id = this.youTubeGetID(url);
			src_preview = `//img.youtube.com/vi/${id}/maxresdefault.jpg`;

			img.src = src_preview;
			img.onload = function () {
				let height = this.height;
				if (height > 480) {
					$youtube.css({
						'background-image': `url(${src_preview})`
					});
					$btn.attr('href', url);
				} else {
					src_preview = `//img.youtube.com/vi/${id}/sddefault.jpg`;

					$youtube.css({
						'background-image': `url(${src_preview})`
					});
					$btn.attr('href', url);
				}
			};
			img.onerror = function () {
				$youtube.css({
					'background-image': `url('/assets/img/content/basic-idea.jpg')`
				});
			};
		}
	}

	/**
	 * Инициализация слайдера
	 * @param {'.selector'} selector
	 * @param {*} option
	 */
	initSwiper(selector,option){
		return new Swiper(selector, option);
	}

	/**
	 * Показывает заданное количество элементов
	 * @param {*} $items
	 * @param {*} count
	 */
	drawItems($items, count){
		$items.each(function (index, el) {
			if(index < count){
				$(el).fadeIn(800);
			} else {
				$(el).fadeOut(0);
			}
		});
	}

	/**
	 * горячий ресайзенг слайдера, отключение/включение
	 * 
	 * @param {*} selectSlider
	 * @param {*} slideOption
	 * @param {*} obj.count - объект содержащий нужное количество элементов при <= 480
	 */
	resizeSlider(selectSlider,slideOption,obj){
		let app = this;

		let team_slider;

		let $slider = $(selectSlider);
		let $wrapper = $slider.find('.js_slider_wrapper');
		let $items = $slider.find('.js_slider_item');

		$(window).resize(function () {
			if($(window).width() > 480 && !team_slider) {
				team_slider = app.initSwiper(selectSlider, slideOption);
				$items.css('display','');
			} else if($(window).width()<=480) {
				app.drawItems($items, obj.count);
			}

			if($(window).width()<=480 && team_slider){
				team_slider.destroy(true, false);

				$slider.removeClass('swiper-container');
				$wrapper
					.removeClass('swiper-wrapper')
					.attr('style','');
				$items
					.removeClass('swiper-slide')
					.width('')
					.height('')
					.css('margin-right','');

				// console.log(partners_slider);

			} else if (team_slider && team_slider.destroyed == true) {
				// console.log('init');
				$slider.addClass('swiper-container');
				$wrapper.addClass('swiper-wrapper');
				$items
					.addClass('swiper-slide')
					.css('display','');

				team_slider = app.initSwiper(selectSlider, slideOption);
			}

		});
		$(window).resize();
	}
}

export default new Site();