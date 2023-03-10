//moi
//source/modules/moi/moi/activate.js

//source/general/wrapper.js
// templates/wrapper.js
(function ( klevu ) {

  
//source/modules/moi/moi/core.js
klevu.extend(true, klevu.moiEvents, {
    init:{
        build: function () {
                var componentDomain = klevu.getGlobalSetting("url.componentUrl",false);
                var defaultCss =(componentDomain?componentDomain:"https://js.klevu.com/components/") + "moi/v2/moi.css";

                klevu.css.link(klevu.getGlobalSetting("moi.css",defaultCss),"moi-css");
                var nodeTarget = klevu.dom.getFirst(klevu.getGlobalSetting("moi.moiTarget"));
                if(nodeTarget.nodeType == 1){
                    //powerup the base template
                    klevu.moi.base.getScope().template.setData({settings:{imageLocation:klevu.getGlobalSetting("moi.imageLocation","https://js.klevu.com/components/moi/v2/images")}});
                    nodeTarget.innerHTML = klevu.moi.base.getScope().template.render("base");
                    //set the links between elements
                    nodeTarget.moiObject = klevu.moi.base;
                    klevu.moi.base.getScope().target = nodeTarget;
                    klevu.moi.base.getScope().element = klevu.dom.getFirst("input#message",klevu.moi.base.getScope().target);
                    klevu.moi.base.getScope().element.moiObject = klevu.moi.base;
                    klevu.moi.base.getScope().element.moiScope = klevu.moi.base.getScope();
                    klevu.moi.base.getScope().element.moiElem = klevu.moi.base.getScope().element;
                    klevu.moi.base.getScope().target.moiObject = klevu.moi.base.getScope().element.moiObject;
                    klevu.moi.base.getScope().target.moiScope = klevu.moi.base.getScope().element.moiScope;
                    klevu.moi.base.getScope().target.moiElem = klevu.moi.base.getScope().element.moiElem;
                    klevu.moiEvents.init.bindTyping(klevu.moi.base);
                    //add scope so we can open chat
                    klevu.dom.getFirst(klevu.getGlobalSetting("moi.closeChat"),klevu.moi.base.getScope().target).moiScope = klevu.moi.base.getScope().element.moiScope;
                    klevu.dom.getFirst(klevu.getGlobalSetting("moi.menuBoxButton"),klevu.moi.base.getScope().target).moiScope = klevu.moi.base.getScope().element.moiScope;
                    //attach events
                    klevu.event.attach( klevu.dom.getFirst(klevu.getGlobalSetting("moi.menuBoxButton"),klevu.moi.base.getScope().target) , "click" , klevu.moiEvents.menu.toggleMoiMenu , true );
                    //klevu.event.attach( klevu.dom.getFirst(klevu.getGlobalSetting("moi.closeChat"),klevu.moi.base.getScope().target) , "click" , klevu.moiEvents.display.safeCloseMoi , true );
                    klevu.event.attach( klevu.dom.getFirst(klevu.getGlobalSetting("moi.cancelChat"),klevu.moi.base.getScope().target) , "click" , klevu.moiEvents.display.forceCloseMoi , true );
                    klevu.event.attach( klevu.dom.getFirst(klevu.getGlobalSetting("moi.chatList"),klevu.moi.base.getScope().target) , "click" , klevu.moiEvents.menu.closeMenuOverChat , true );
                    klevu({moi:{container:nodeTarget}});
                    //moi document click
                    klevu.settings.chains.documentClick.add({
                        name: "hideMoi",
                        position:0,
                        fire: function (data, scope) {
                            var screenWidth = window.innerWidth;
                            if (screenWidth <= 640){
                                return;
                            }
                            var openMoi = (data.event.target.classList.contains('openMoi'))?
                                true:
                                (klevu.dom.getFirst(".openMoi",data.event.target).nodeType === 1);
                            if(openMoi){
                                return;
                            }
                            if(klevu.dom.helpers.getClosest(data.event.target,".klevu-moi")){
                                return;
                            }
                            klevu.moiEvents.display.safeCloseMoi();
                        }
                    });
                    //moi persistence

                    var moiDictionary = klevu.moiEvents.init.loadDataFromStorage();
                    var overrideFocus = moiDictionary.getElement("overrideFocus");

                    overrideFocus = (overrideFocus === 'true');

                    var state = moiDictionary.getElement("state");
                    state = (state === 'true');
                    // override value for mobile view
                    var screenWidth = window.innerWidth;
                    if (screenWidth <= 640){
                        state = false;
                    }
                    klevu({component:{moi:{overrideFocus:overrideFocus,state:state}}});

                }
            },
        link:function(){
            var customMessage = klevu.getGlobalSetting("moi.customQuickMessage",`<div class="moiBar"><div class="moiBarText"><span>Chat Mode</span><a href="#" class="openMoi moiSwitchOff"><span>OFF</span></a></div></div>`);
            klevu.each(klevu.search.extraSearchBox, function (key, box) {
                box.getScope().template.setTemplate(customMessage,"customBlockTop",true);
                box.getScope().chains.template.events.add({
                    name:"moiActivate",
                    fire:function(data,scope){
                        var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                        klevu.each(klevu.dom.find(".openMoi", target), function (key, value) {
                            klevu.event.attach(value, "click", function (event) {
                                event = event || window.event;
                                event.preventDefault();
                                klevu.moiEvents.display.forceOpenMoi();
                                klevu.each(klevu.search.extraSearchBox, function (key, box) {
                                    var fullPage = klevu.getSetting(box.getScope().settings, "settings.search.fullPageLayoutEnabled", true);
                                    if (!fullPage) {
                                        var target = klevu.getSetting(box.getScope().settings, "settings.search.searchBoxTarget");
                                        target.style = "display: none !important;";
                                    }
                                });
                            }, true);
                        });
                    }
                });
                box.getScope().chains.events.focus.add({
                    name:"moiActivate",
                    position:0,
                    fire:function(data,scope){
                        var overrideFocus = klevu.moiEvents.init.getOverrideFocus();
                        if(overrideFocus){
                            klevu.moiEvents.display.forceOpenMoi();
                            return false;
                        }
                    }
                });
            });
            var overrideFocus = klevu.moiEvents.init.getOverrideFocus();
            var state = klevu.moiEvents.init.getState();
            if (overrideFocus && state){
                setTimeout(klevu.moiEvents.display.forceOpenMoi, 2000);
            }
        }
    },
    menu:{
        closeMenuOverChat : function(event){
            var scope = klevu.dom.helpers.getClosest(this,".moiContainer").moiElem;
            klevu.moiEvents.menu.closeMoiMenu(scope);
        }
    },
    display:{
        loadTemplate:function () {
                mainTpl= `<div class="kumoiArea">
		  <div class="kumoiareaInside">
			<div class="kumoiOverlay" style="display:none;">
				<div class="kumoiOverlayInner">
					<div class="kumoiOverlayContent">
					<!-- Overlay Content will render Here -->
					</div>
				</div>
			</div>

			<div class="kumoiareaHeader">
			 <div class="kumoiareaheaderrow">		
				<div class="kumoiareaheaderCol kumoiheaderCol1">
				 <div class="kumoiLogo"><span><svg width="39" height="15" viewBox="0 0 39 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M15.6972 0.0374756V14.9405H13.2515V4.73201L8.70401 14.9405H7.00887L2.44575 4.73201V14.9405H0V0.0374756H2.63654L7.86895 11.7253L13.0795 0.0374756H15.6941H15.6972Z" fill="black"/>
                 <path d="M38.125 0.078186V14.9812H35.6792V0.078186H38.125Z" fill="black"/>
                 <path d="M18.2087 7.5C18.2087 3.3653 21.5739 0 25.7086 0C29.8432 0 33.2085 3.3653 33.2085 7.5C33.2085 11.6347 29.8432 15 25.7086 15H18.2087V7.5ZM20.3542 7.5V12.8545H25.7086C28.661 12.8545 31.063 10.4525 31.063 7.5C31.063 4.54754 28.661 2.14554 25.7086 2.14554C22.7562 2.14554 20.3542 4.54754 20.3542 7.5Z" fill="black"/>
                 </svg></span></div>
				
			   </div>
				<div class="kumoiareaheaderCol kumoiheaderCol2">
                    <div class="moiBar">
                        <div class="moiBarText">
                            <span>Chat Mode</span>
                            <a href="#" class="ksMoiCancelIcon moiSwitchOn"><span>ON</span></a>
                        </div>
                    </div>
					
					</div>
				<div class="clearfix"></div>
			</div>
			</div><!-- ends kmoiareaHeader -->
			<div class="kumoiareaContent" id="chat">
				
			</div>
			
		   </div><!-- ends kumoiareaContent -->
		   <div class="kumoiareaFooter">
			<div class="kumoiFooterWrap">
				<div class="kumoifilterList kumoifixOptions moiButtons">  
				</div>
                <div class="kumoiInputWrapper">
                <div class="moi-menuOptions moiMenuButtons moiMenu">
				</div>
				 <div class="moi-menuIconBlock">
                    <button id="moi-menuIcon" class="moi-menuIcon toggleMoiMenu disabled">
                        <div>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                 </div>
						<form class="kumoiTypeform" action="" name="kumoiTypeform">
							<input type="text" name="message" id="message" class="kumoiTypefield" placeholder="Type your question here..." autocomplete="off" autocorrect="off" autocapitalize="off">
						<button class="moi-inputBtn"></button>
				</form>
                </div>
			</div>
			</div>
		<!-- ends kmoiareaFooter -->
			
		  </div><!-- ends kmoiareaInside-->   
		</div><!-- ends kmoiArea-->`;

                menuTpl = `<% helper.each(data.buttons, function(key,button) { %>
					  <a href="#" class="moi-menuOption" data-action="<%=button.type%>" data-chat="<%=button.chat%>" data-options="<%=encodeURIComponent(JSON.stringify(button.options))%>"><span class="moi-menuTxt"><%=button.name%></span></a>
						<% }); %>
				  `;
                buttonsTpl = `<% helper.each(data.buttons, function(key,button) { %>
					  <a href="#" class="kumoifiltername" data-action="<%=button.type%>" data-chat="<%=button.chat%>"><%=button.name%></a>
						<% }); %>
				  `;


                dateTpl = `<div class="kumoichatRow kumoichatDate">			
			<div class="kumoiDateBlock"><span class="kumoiDatetxt"><%=data.message%></span></div>
				<div class="clearfix"></div>
			</div>`;





                messageTpl = `<div class="kumoichatRow <%=data.className%>">
				  <div class="kumoimsgBlock"><div class="kumoimsgContent"><%=data.message%></div></div>
				  <% if(data.note){ %><div class="kumoiHintmessage"><%=data.note%></div><% } %>
				  <div class="clearfix"></div>
				  </div>
				`;




                filtersTpl  = `<div class="kumoichatRow <%=data.className%>">
					<% if(data.message){ %>
				  <div class="kumoimsgBlock"><div class="kumoimsgContent"><%=data.message%></div></div>
					  <% } %>
				  <div class="kumoifilterList kumoicategoryList" data-chat="<%=data.chatValue%>" data-chat-empty="<%=data.chatEmptyValue%>">
					<% helper.each(data.options, function(key,optionLine) { %>
					  <a href="#" class="kumoifiltername<%if(optionLine.selected == 'true') { %> active<% } %>" data-value="<%=optionLine.value%>"><%=optionLine.name%></a>
						<% }); %>
				  </div>
				  <% if(data.note){ %><div class="kumoiHintmessage"><%=data.note%></div><% } %>
				  <div class="clearfix"></div>
					</div>`;

                productTpl = `<div class="kumoichatRow <%=data.className%>">
			<div class="moiProductSlider">
				<div class="moiProductSlidesContainer">
				  <% helper.each(data.products, function(key,product) { %>
					<div class="moiSlides fade">  
						<div class="moiProductBlock" data-id="<%=product.id%>">
						  <div class="moiProductContent">
							  <div class="moiProductImgwrap"><a href="<%=product.url%>" target="_blank" class="kumoiProductitem"><img src="<%=product.image%>" alt="#"></a></div>
							  <div class="moiProductBrief">
								<div class="moiProductTitle"><a href="<%=product.url%>" target="_blank" class="kumoiProductitem"><%=product.name%></a></div>
								<div class="moiProductShortDesc"><%=product.shortDesc%></div>
								<div class="moiProductPrice">
									<div class="moiProductPriceWrap">
                                    <div class="moiprice moiPriceTxt">Starts at</div>
                                    <% if(product?.currency !== ''){
                                            const formatCurrency = new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: product.currency,
                                            }); %>
                                            <div class="moiprice moiSalePrice"><%=formatCurrency.format(product.salePrice)%></div>

                                            <%if(product.price && product.price != product.salePrice) { %>
                                                <div class="moiprice moiOrigPrice"><%=formatCurrency.format(product.price)%></div>
                                            <% } %>
                                        <% } else {  %>
                                            <div class="moiprice moiSalePrice"><%=product.currency%> <%=product.salePrice%></div>

                                            <%if(product.price && product.price != product.salePrice) { %>
                                                <div class="moiprice moiOrigPrice"><%=product.currency%> <%=product.price%></div>
                                            <% } %>
                                        <% }  %>
										
										
									</div>
								</div>
							  </div>
							<div class="clearleft"></div>
						  </div>
					
						  <% if (typeof(product.options) !== "undefined") { %>
							<div class="moiProductlinks">
								<% helper.each(product.options, function(key,optionLine) { %>
								  <a  href="#" class="moiProductLink action kumoi-text" data-intent="<%=optionLine.intent%>" data-chat="<%=optionLine.chat%>" alt="<%=optionLine.name%>"><%=optionLine.name%></a>
								<% }); %>
							</div>
						  <% } %>
						</div>
					</div>
					<% }); %>
					<div class="moiSliderArrowNav">
						<a class="prev" data-slide="-1">❮</a>
						<a class="next" data-slide="1">❯</a>
					</div>

					<div class="moiSliderdotNav">
					<% var counterOfButtons = 1; %>
						<% helper.each(data.products, function(key,product) { %>
							<span class="moiSliderdot" data-slide="<%=counterOfButtons%>"></span> 
					  <% counterOfButtons++; %>
					  <% }); %>
					</div>
					<!-- ends kumoiproductslider-->
				</div>
			</div>
			<% if(data.note){ %><div class="kumoiHintmessage"><%=data.note%></div><% } %>
			<div class="clearfix"></div>
	</div><!-- ends kumoichatRow -->`;


                productOverlayTpl  = `
                        <div class="kumoiOverlayProductWrapper">
                            <a href="#" class="kumoiOverlayClose"><span class="closeIcon"></span></a>
                            <div class="moiQuickViewProductBlock moiProductBlock" data-id="<%=data.product%>">
						    </div>
                        </div>
						`;



                customerSupportOverlayTpl  = `<a href="#" class="kumoiOverlayClose"><span class="closeIcon"></span></a>
						<div class="kumoiForm kumoifeedbackForm">
						<% if(data.title) { %><h3 class="kumoiFormTitle"><%=data.title.value%></h3><% } %>
						<form action="#" class="moiQuickViewFormContent" data-chat="<%=data.chat%>" data-type="<%=data.type%>">

							<% if(data.name) { %> <div class="kumoiFieldWrap"><input type="text" class="kumoiField moiQuickViewFormField" data-validations="<%=data.name.validations%>" id="" name="<%=data.name.key%>" placeholder="<%=data.name.value%>"></div><% } %>
							<% if(data.email) { %> <div class="kumoiFieldWrap"><input type="email" class="kumoiField moiQuickViewFormField" data-validations="<%=data.email.validations%>" id="" name="<%=data.email.key%>" placeholder="<%=data.email.value%>"></div><% } %>
							<% 
							if(data.rating) { %> 
							<div class="kumoiFieldWrap">
								<div class="kumoiFeedbackbtns">
									<div class="ratinglabel"><%=data.rating.value%></div>
									<label>
									  <input type="radio" name="<%=data.rating.key%>" value="3" checked class="moiQuickViewFormField">
									  <img src="<%=data.settings.imageLocation%>/moi-smily1.png" width="28" class="feedbackIcon">
									</label>

									<label>
									  <input type="radio" name="<%=data.rating.key%>" value="2" class="moiQuickViewFormField">
									  <img src="<%=data.settings.imageLocation%>/moi-smily2.png" width="28" class="feedbackIcon">
									</label>
									<label>
									  <input type="radio" name="<%=data.rating.key%>" value="1" class="moiQuickViewFormField">
									  <img src="<%=data.settings.imageLocation%>/moi-smily3.png" width="28" class="feedbackIcon">
									</label>
								</div>
							</div>
							<% } %>
							<% if(data.desc) { %> 
								<div class="kumoiFieldWrap">
									<textarea id="" name="<%=data.desc.key%>" class="kumoiField moiQuickViewFormField" data-validations="<%=data.desc.validations%>" placeholder="<%=data.desc.value%>"></textarea>
								</div>
							<% } %>
							
							<% if(data.button) { %> <div class="kumoiFieldWrap"><input type="submit" class="kumoiBtn moiQuickViewFormSubmit" name="submit" value="<%=data.button.value%>"> <% } %>
						</form>
					</div>
					<!-- ends .kumoiForm -->`;





                feedbackOverlayTpl  = `<a href="#" class="kumoiOverlayClose"><span class="closeIcon"></span></a>
						<div class="kumoiForm kumoifeedbackForm">
						<% if(data.title) { %><h3 class="kumoiFormTitle"><%=data.title.value%></h3><% } %>
						<form action="#" class="moiQuickViewFormContent" data-chat="<%=data.chat%>" data-type="<%=data.type%>">

							<% if(data.name) { %> <div class="kumoiFieldWrap"><input type="text" class="kumoiField moiQuickViewFormField" data-validations="<%=data.name.validations%>" id="" name="<%=data.name.key%>" placeholder="<%=data.name.value%>"></div><% } %>
							<% if(data.email) { %> <div class="kumoiFieldWrap"><input type="email" class="kumoiField moiQuickViewFormField" data-validations="<%=data.email.validations%>" id="" name="<%=data.email.key%>" placeholder="<%=data.email.value%>"></div><% } %>
							<% 
							if(data.rating) { %> 
							<div class="kumoiFieldWrap">
								<div class="kumoiFeedbackbtns">
									<div class="ratinglabel"><%=data.rating.value%></div>
									<label>
									  <input type="radio" name="<%=data.rating.key%>" value="3" checked class="moiQuickViewFormField">
									  <img src="<%=data.settings.imageLocation%>/moi-smily1.png" width="28" class="feedbackIcon">
									</label>

									<label>
									  <input type="radio" name="<%=data.rating.key%>" value="2" class="moiQuickViewFormField">
									  <img src="<%=data.settings.imageLocation%>/moi-smily2.png" width="28" class="feedbackIcon">
									</label>
									<label>
									  <input type="radio" name="<%=data.rating.key%>" value="1" class="moiQuickViewFormField">
									  <img src="<%=data.settings.imageLocation%>/moi-smily3.png" width="28" class="feedbackIcon">
									</label>
								</div>
							</div>
							<% } %>
							<% if(data.desc) { %> 
								<div class="kumoiFieldWrap">
									<textarea id="" name="<%=data.desc.key%>" class="kumoiField moiQuickViewFormField" data-validations="<%=data.desc.validations%>" placeholder="<%=data.desc.value%>"></textarea>
								</div>
							<% } %>
							
							<% if(data.button) { %> <div class="kumoiFieldWrap"><input type="submit" class="kumoiBtn moiQuickViewFormSubmit" name="submit" value="<%=data.button.value%>"> <% } %>
						</form>
					</div>
					<!-- ends .kumoiForm -->`;
                klevu.moi.base.getScope().template.setTemplate( mainTpl , "base" , true );
                klevu.moi.base.getScope().template.setTemplate( messageTpl , "message" , true );
                klevu.moi.base.getScope().template.setTemplate( dateTpl , "date" , true );
                klevu.moi.base.getScope().template.setTemplate( filtersTpl , "filters" , true );
                klevu.moi.base.getScope().template.setTemplate( productTpl , "product" , true );
                klevu.moi.base.getScope().template.setTemplate( menuTpl , "menu" , true );
                klevu.moi.base.getScope().template.setTemplate( buttonsTpl , "buttons" , true );
                klevu.moi.base.getScope().template.setTemplate( productOverlayTpl , "productOverlay" , true );
                klevu.moi.base.getScope().template.setTemplate( customerSupportOverlayTpl , "customerSupportOverlay" , true );
                klevu.moi.base.getScope().template.setTemplate( feedbackOverlayTpl , "feedbackOverlay" , true );

            },
        initContainer:function(){
            // <div class="moi-chatIconBtn toggleMoi" id="moi-chatIconBtn" style="display:none;"><span class="moi-chatIcontxt">Ask Moi</span><img class="moi-chatIcon" src="<%=data.settings.imageLocation%>/moi-chat-icon.png"/></div>
            var containerTpl = `
                <div class="moiContainer" id="moiContainer" style="display:none;">
                     <!-- moi containers scripts START here -->
                </div>`;
            klevu.moi.base.getScope().template.setTemplate( containerTpl , "container" , true );
            klevu.moi.base.getScope().template.setData({settings:{imageLocation:klevu.getGlobalSetting("moi.imageLocation","https://js.klevu.com/components/moi/v2/images")}});

            klevu.dom.helpers.addElementToParent( null , "div" , {
                id : "klevumoicontainer" ,
                "class" : "klevu-moi"
            } );
            klevu.setSetting( klevu.moi.base.getScope().settings , "settings.moi.containerTarget" , document.getElementById( "klevumoicontainer" ) );

            var element = klevu.moi.base.getScope().template.convertTemplate(klevu.moi.base.getScope().template.render("container"));

            var target = klevu.getSetting( klevu.moi.base.getScope().settings, "settings.moi.containerTarget");
            target.innerHTML = '';
            klevu.moi.base.getScope().template.insertTemplate(target, element);
        }
    },

    slider:{
        init: function(renderData,scope){
            // arrows
            klevu.each( klevu.dom.find( klevu.getSetting( scope.moiScope.settings , "settings.moi.productSliderArrow" )+" a" , renderData.tpl ) , function ( key , value ) {
                klevu.event.attach( value , "click" , klevu.moiEvents.slider.plusSlides , true );
            });
            //dots
            klevu.each( klevu.dom.find( klevu.getSetting( scope.moiScope.settings , "settings.moi.productSliderDots" ) , renderData.tpl ) , function ( key , value ) {
                klevu.event.attach( value , "click" , klevu.moiEvents.slider.currentSlide , true );
            });
            //init
            klevu.each( klevu.dom.find( klevu.getSetting( scope.moiScope.settings , "settings.moi.productSlider" ) , renderData.tpl ) , function ( key , value ) {
                value.currentMoiSlide = 1;
                value.moiScope = scope.moiScope;
                klevu.moiEvents.slider.showSlides(value);
            });

        },
        plusSlides:function(event){
            event = event || window.event;
            //prevent the submit we will handle this in other ways
            event.preventDefault();
            /* DEBUG CODE START */
            if ( klevu.getGlobalSetting("console.type.event",false) ) {
                klevu.logDebug( "Event - plusSlides" );
                klevu.logDebug( event );
            }
            /* DEBUG CODE END */
            var scope = klevu.dom.helpers.getClosest(this,".moiContainer").moiElem;
            var slider = klevu.dom.helpers.getClosest(this,klevu.getSetting( scope.moiScope.settings , "settings.moi.productSlider" ));
            slider.currentMoiSlide = slider.currentMoiSlide +  parseInt(this.dataset.slide);
            klevu.moiEvents.slider.showSlides(slider);
        },
        currentSlide:function(event){
            event = event || window.event;
            //prevent the submit we will handle this in other ways
            event.preventDefault();
            /* DEBUG CODE START */
            if ( klevu.getGlobalSetting("console.type.event",false) ) {
                klevu.logDebug( "Event - currentSlide" );
                klevu.logDebug( event );
            }
            /* DEBUG CODE END */
            var scope = klevu.dom.helpers.getClosest(this,".moiContainer").moiElem;
            var slider = klevu.dom.helpers.getClosest(this,klevu.getSetting( scope.moiScope.settings , "settings.moi.productSlider" ));
            slider.currentMoiSlide = parseInt(this.dataset.slide);
            klevu.moiEvents.slider.showSlides(slider);
        },
        showSlides:function(slider) {
            var i;
            var slides = klevu.dom.find(klevu.getSetting( slider.moiScope.settings , "settings.moi.productSlide" ),slider);
            var dots = klevu.dom.find(klevu.getSetting( slider.moiScope.settings , "settings.moi.productSliderDots" ),slider);
            if (slider.currentMoiSlide > slides.length) {slider.currentMoiSlide = 1}
            if (slider.currentMoiSlide < 1) {slider.currentMoiSlide = slides.length}
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            for (i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace(" active", "");
            }
            slides[slider.currentMoiSlide-1].style.display = "block";
            if(slides[slider.currentMoiSlide] !== undefined) {
                slides[slider.currentMoiSlide].style.display = "block";
            }
            //slider navigations
            //hide next when no more slides
            if(slides[slider.currentMoiSlide] === undefined || slides[slider.currentMoiSlide+1] === undefined){
                klevu.dom.getFirst( klevu.getSetting( slider.moiScope.settings , "settings.moi.productSliderArrow" )+" a.next" , slider ).style.display = "none";
            } else {
                klevu.dom.getFirst( klevu.getSetting( slider.moiScope.settings , "settings.moi.productSliderArrow" )+" a.next" , slider ).style.display = "block";
            }
            //hide previous when no more slides
            if(slider.currentMoiSlide == 1){
                klevu.dom.getFirst( klevu.getSetting( slider.moiScope.settings , "settings.moi.productSliderArrow" )+" a.prev" , slider ).style.display = "none";
            } else {
                klevu.dom.getFirst( klevu.getSetting( slider.moiScope.settings , "settings.moi.productSliderArrow" )+" a.prev" , slider ).style.display = "block";
            }

            dots[slider.currentMoiSlide-1].className += " active";
        }
    },
    overlay:{
        productShortDesc: function(scope){
            klevu.each(klevu.dom.find(klevu.getSetting(scope.moiScope.settings, "settings.moi.overlayProductShortDesc"), klevu.dom.getFirst(klevu.getSetting( scope.moiScope.settings , "settings.moi.overlay" ),scope.moiScope.target)), function (key, value) {
                klevu.event.attach(value, "click", function (event) {
                    event.preventDefault();
                    this.classList.toggle(klevu.getSetting(scope.moiScope.settings, "settings.moi.overlayProductShortDescActive"));
                });
            });
        },
    }
});


 

})( klevu );
//source/modules/moi/moi/events-build.js
klevu.settings.chains.initChain.add(
    {
        name:"moiCheck",
        /**
         *  initialisation for the moi module
         *  @param {object} data - object containing the klevu settings
         *  @param {object} scope - klevu object scope
         */
        fire: function(data,scope) {
            var moiGlobalLoaded = klevu.getGlobalSetting("component.moi.loaded",false);
            if(!moiGlobalLoaded){
                if ( !klevu.isInteractive ||
                    klevu.isUndefined( klevu.moi ) ||
                    klevu.isUndefined( klevu.moi.build )  ) {
                    return;
                }
                klevu.setObjectPath(data,"component.moi.loaded",true);
                klevu.moiEvents.display.loadTemplate();
                klevu.moiEvents.display.initContainer();
                klevu.moiEvents.init.build();
            }
        }
    }
);
klevu.settings.chains.initChain.add(
    {
        name:"moiLinkCheck",
        /**
         *  initialisation for the moi module
         *  @param {object} data - object containing the klevu settings
         *  @param {object} scope - klevu object scope
         */
        fire: function(data,scope) {

            var moiGlobalLinked = klevu.getGlobalSetting("component.moi.linked",0);
            var quickSearchNumber = klevu.getObjectPath(klevu.search,"extraSearchBox.length",0);
            if(quickSearchNumber > 0  && moiGlobalLinked < quickSearchNumber){
                var moiGlobalLoaded = klevu.getGlobalSetting("component.moi.loaded",false);
                if(!moiGlobalLoaded){
                 return false;
                }
                klevu.setObjectPath(data,"component.moi.linked",quickSearchNumber);
                klevu.moiEvents.init.link();
            }
        }
    }
);

// force a settings change to enable the object modifications
klevu({flags:{moi:{loaded:true}}});
//moi
