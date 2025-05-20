$(function() {
  $widget.each(function(index, el) {
    new LazyLoad({
      container: $(el).get(0),
      elements_selector: '.lazyload'
    });
  });


  $(document).ready(function() {
    let specialProducts = $widget.find(".js-special-subcollection");

    specialProducts.each(function() {
      let special_products_block = $(this);
      let slider_block = special_products_block.find(".js-special-subcollection-slider");
      let slide_min_width = 220;
      let slide_gap = 30;

      if (slider_block.is("[data-slide-min-width]")) {
        slide_min_width = parseInt(slider_block.data("slideMinWidth"));
      } else {
        slider_block.data("slideMinWidth", slide_min_width);
      }

      if (slider_block.is("[data-slide-gap]")) {
        slide_gap = parseInt(slider_block.data("slideGap"));
      } else {
        slider_block.data("slideGap", slide_gap);
      }

      slider_block[0].splide = new Splide(slider_block[0], {
        perPage: getSlidesPerVew(slider_block, slide_min_width, slide_gap),
        gap: slide_gap,
        perMove: 1
      });

      $(window).on("resize", function() {
        let slide_min_width = parseInt(slider_block[0].dataset.slideMinWidth);
        let slide_gap = parseInt(slider_block[0].dataset.slideGap);

        slider_block[0].splide.options = { perPage: getSlidesPerVew(slider_block, slide_min_width, slide_gap)};
        configureDragOption(slider_block);
      });

      slider_block[0].splide.on( 'mounted updated', function() {
        displaySliderControls(slider_block);
      });

      slider_block[0].splide.on( 'mounted', function() {
        configureDragOption(slider_block);
      });

      slider_block[0].splide.mount();

      $widget.find(".js-move-slide").on("click", function() {
        let slider_node = $(this).parents(".js-special-subcollection").find(".js-special-subcollection-slider");

        if (slider_node.length) {
          let sliderInst = slider_node[0].splide;

          if ($(this).is(".special-subcollection__slider-arrow-prev")) {
            sliderInst.go( '-' );
          }

          if ($(this).is(".special-subcollection__slider-arrow-next")) {
            sliderInst.go( '+' );
          }
        }
      });
    });
  });

  $(function() {
    EventBus.subscribe(['widget:input-setting:insales:system:editor', 'widget:change-setting:insales:system:editor'], (data) => {
      $widget.each(function(index, el) {
        if (data.widget_id == $(el).parents(".editable-widget").data("widgetId")) {
          let widget_slider_node = $('[data-widget-id="' + data.widget_id + '"] .js-special-subcollection-slider');

          if (widget_slider_node.length) {
            widget_slider_node.each(function() {
              updateSpecialProductSlider($(this), data);
            });
          }
        }
      });
    });
  });

  function updateSpecialProductSlider(slider, data) {
    let sliderInst = slider[0].splide;

    let slide_min_width = parseInt(slider.data("slideMinWidth"));
    let slide_gap = parseInt(slider.data("slideGap"));

    if (data.setting_name == 'slide-width') {
      let new_slide_min_width = parseInt(data.value);
      let new_per_page = getSlidesPerVew(slider, new_slide_min_width, slide_gap);
      slider.attr("data-slide-min-width", new_slide_min_width);

      sliderInst.options = { perPage: new_per_page };
    } else if (data.setting_name == 'slide-gap') {
      let new_slide_gap = parseInt(data.value);
      let new_per_page = getSlidesPerVew(slider, slide_min_width, new_slide_gap);
      slider.attr("data-slide-gap", new_slide_gap);

      sliderInst.options = { gap: new_slide_gap, perPage: new_per_page };
    } else {
      setTimeout(function() { sliderInst.refresh() }, 0);
    }

    configureDragOption(slider);
  }

  function getSlidesPerVew(sliderBlock, slideMinWidth, slideGap) {
    return Math.floor(sliderBlock.width() / (slideMinWidth + slideGap));
  }

  function displaySliderControls(slider) {
    let sliderInst = slider[0].splide;
    let special_products = slider.parents(".js-special-subcollection");
    let prev_btn = special_products.find(".special-subcollection__slider-arrow-prev");
    let next_btn = special_products.find(".special-subcollection__slider-arrow-next");

    if (sliderInst.length <= sliderInst.options.perPage) {
      prev_btn.addClass("is-hide");
      next_btn.addClass("is-hide");
      slider.addClass("is-hide-paging");
    } else {
      prev_btn.removeClass("is-hide");
      next_btn.removeClass("is-hide");
      slider.removeClass("is-hide-paging");
    }
  }

  function configureDragOption(slider) {
    if (slider[0].splide.length <= slider[0].splide.options.perPage) {
      slider[0].splide.options = { drag: false };
    } else {
      slider[0].splide.options = { drag: true };
    }
  }
});
