/**
 * chosen.jquery.selectall removeall plugin
**/
void function($, _){
	$(function(){
		ChonseSelectPlugin = function() {
			$("select").on("chosen:showing_dropdown", function(evnt, params) {
				var chosen = params.chosen,
					$dropdown = $(chosen.dropdown),
					$field = $(chosen.form_field);
				if( !chosen.__customButtonsInitilized ) {
					chosen.__customButtonsInitilized = true;
					var contained = function( el ) {
						var container = document.createElement("div");
						container.appendChild(el);
						return container;
					}
					var width = $dropdown.width();
					var opts = chosen.options || {},
						showBtnsTresshold = opts.disable_select_all_none_buttons_tresshold || 0;
						optionsCount = $field.find("option").length,
						selectAllText = opts.select_all_text || '全选',
						selectNoneText = opts.uncheck_all_text || '全不选';
					if( chosen.is_multiple && optionsCount >= showBtnsTresshold ) {
						var selectAllEl = document.createElement("a"),
							selectAllElContainer = contained(selectAllEl),
							selectNoneEl = document.createElement("a"),
							selectNoneElContainer = contained(selectNoneEl);
						selectAllEl.appendChild( document.createTextNode( selectAllText ) );
						selectNoneEl.appendChild( document.createTextNode( selectNoneText ) );
						$dropdown.prepend("<div class='ui-chosen-spcialbuttons-foot' style='clear:both;border-bottom: 1px solid black;'></div>");
						$dropdown.prepend(selectNoneElContainer);
						$dropdown.prepend(selectAllElContainer);
						var $selectAllEl = $(selectAllEl),
							$selectAllElContainer = $(selectAllElContainer),
							$selectNoneEl = $(selectNoneEl),
							$selectNoneElContainer = $(selectNoneElContainer);
						var reservedSpacePerComp = (width - 25) / 2;
						$selectNoneElContainer.addClass("ui-chosen-selectNoneBtnContainer")
							.css("float", "right").css("padding", "5px 8px 5px 0px")
							.css("max-width", reservedSpacePerComp+"px")
							.css("max-height", "30px").css("overflow", "hidden");
						$selectAllElContainer.addClass("ui-chosen-selectAllBtnContainer")
							.css("float", "left").css("padding", "5px 5px 5px 7px")
							.css("max-width", reservedSpacePerComp+"px")
							.css("max-height", "30px").css("overflow", "hidden");
						$selectAllEl.on("click", function(e) {
							e.preventDefault();
							$field.find("option").prop('selected', true);
							$field.trigger('chosen:updated');
							return false;
						});
						$selectNoneEl.on("click", function(e) {
							e.preventDefault();
							$field.find("option").prop('selected', false);
							$field.trigger('chosen:updated');
							return false;
						});
					}
				}
			});
		}
		ChonseSelectPlugin();
	});
	
}(window.jQuery, window._);
