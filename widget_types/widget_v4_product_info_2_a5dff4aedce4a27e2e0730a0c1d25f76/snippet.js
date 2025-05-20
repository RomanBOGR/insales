$(document).ready(function() {
  let review_notice_success = $widget.find(".product-reviews .notice-success");
  let review_form_message = $widget.find(".product-reviews .form-message");

  if (review_notice_success.length || review_form_message.length) {
    $widget.find('[data-tabs-item="tab-reviews"]').click();
    $('html, body').scrollTop($widget.find(".review-form-wrapper").offset().top);
  }
});

$widget.find("[data-tabs-item]").on("click", function() {
  let this_tab_head = $(this);
  let tabs = $(this).closest(".tabs");
  let tab_item_id = $(this).data("tabsItem");
  let open_tab = tabs.find('#' + tab_item_id);

  if (open_tab.length) {
    if (this_tab_head.parents(".tabs__content").length && this_tab_head.is(".is-active")) {
      this_tab_head.removeClass("is-active");
      tabs.find('#' + tab_item_id).addClass("is-hide-mobile");
    } else {
      tabs.find(".tabs__item.is-active, .tabs__head-item.is-active").removeClass("is-active");
      tabs.find('#' + tab_item_id).addClass("is-active").removeClass("is-hide-mobile");
      this_tab_head.addClass("is-active");
      tabs.find('[data-tabs-item="' + tab_item_id + '"]').addClass("is-active");
      $('html, body').animate({
        scrollTop: this_tab_head.offset().top - 5
      }, 'slow');
    }

    if (open_tab.find(".masonry-reviews-list").length) {
      resizeAllMassonryGridItems();
    }
  }
});

$widget.find('.js-more-items').on("click", function() {
  const block_with_more_items = $(this).parents(".block-with-more-items:first");

  block_with_more_items.find('.hidden-item').removeClass('hidden-item');
  $(this).hide().parents(".more-items").hide();

  if (block_with_more_items.find(".masonry-reviews-list").length) {
    resizeAllMassonryGridItems();
  }
});


/* Reviews */
function resizeMassonryGridItem(item) {
  let grid = document.getElementsByClassName("masonry-reviews-list")[0];
  let rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
  let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));

  if (rowGap == 0) {
    rowGap = 1;
  }

  let rowSpan = Math.ceil((item.querySelector('.masonry-reviews-item__content').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));

  item.style.gridRowEnd = "span " + rowSpan;
}

function resizeAllMassonryGridItems() {
  const allItems = document.getElementsByClassName("masonry-reviews-item");

  for (let x = 0; x < allItems.length; x++) {
    resizeMassonryGridItem(allItems[x]);
  }
}

window.onload = function() {
  resizeAllMassonryGridItems();
}

window.addEventListener("resize", resizeAllMassonryGridItems);

$(function() {
  EventBus.subscribe(['widget:input-setting:insales:system:editor', 'widget:change-setting:insales:system:editor'], (data) => {
    const masonryReviewsList = document.querySelector('[data-widget-id="' + data.widget_id + '"] .masonry-reviews-list');

    if (masonryReviewsList) {
      resizeAllMassonryGridItems();
    }
  });
});

EventBus.subscribe('reviews-open:insales:site', function() {
  let reviews_block = $widget.find("#tab-reviews");

  if (reviews_block.length) {
    $widget.find('[data-tabs-item="tab-reviews"]:first').click();
    $('html, body').animate({scrollTop: reviews_block.offset().top - 20}, 500);
  }
});

EventBus.subscribe('properties-open:insales:site', function() {
  let properties_block = $widget.find("#tab-characteristics");

  if (properties_block.length) {
    $widget.find('[data-tabs-item="tab-characteristics"]:first').click();
    $('html, body').animate({scrollTop: properties_block.offset().top - 20}, 500);
  }
});

$widget.find('.js-show-manager').on("click", function() {
  $(this).parents('.masonry-reviews-item__content').find('.comments-item').toggleClass('hidden');
  resizeAllMassonryGridItems();
  $(this).toggleClass('hidden');
  $(this).parents('.masonry-reviews-item__content').find('.js-hide-manager').toggleClass('hidden');
});

$widget.find('.js-hide-manager').on("click", function() {
  $(this).parents('.masonry-reviews-item__content').find('.comments-item').toggleClass('hidden');
  resizeAllMassonryGridItems();
  $(this).toggleClass('hidden');
  $(this).parents('.masonry-reviews-item__content').find('.js-show-manager').toggleClass('hidden');
});

$widget.find('.js-show-form').on("click", function() {
  $widget.find('.reviews-wrapper').toggleClass('hidden');
  $(this).hide();
});

$widget.find('.js-hide-form').on("click", function() {
  $widget.find('.reviews-wrapper').toggleClass('hidden');
  $widget.find('.js-show-form').show();
});

$widget.find('.js-load-review-image').on("change", function() {
  let str = $(this).val();
  let i = str.lastIndexOf('/') + 1;

  if (str.lastIndexOf('\\')) {
    i = str.lastIndexOf('\\') + 1;
  }

  let filename = str.slice(i);

  $widget.find('.load-review-image-name').html(filename);
});
