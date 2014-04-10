(function(){
	var cssFiles = [
		'/resources/css/ext-all.css',
		'/resources/css/ux-all.css',
		'/resources/images/icons/silk.css',
		'/resources/ux/gridfilters/css/GridFilters.css',
		'/resources/ux/gridfilters/css/RangeMenu.css',
		'/resources/ux/treegrid/treegrid.css',
		'/resources/ux/fileuploadfield/css/fileuploadfield.css',
		'/resources/ux/treegridex/css/TreeGrid.css'
	];
	var createCssTag = function(url){
		var oLink = document.createElement("link");
		oLink.setAttribute("rel" , "stylesheet");
		oLink.setAttribute("type", "text/css");
		oLink.setAttribute("href",url);
		return oLink;
	};
	var oHead = document.getElementsByTagName('head')[0];
	for(var i = 0 ; i < cssFiles.length ; i++){
		oHead.appendChild(createCssTag(Ext.getPath()+cssFiles[i]));
	}	
})();