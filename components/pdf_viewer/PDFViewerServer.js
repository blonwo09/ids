//
// static html component class
//

var PageComponent = require("ds.base/PageComponent");

var PDFViewerServer = PageComponent.create({
	data: function(attributes, vars, containerList) {
		var bucketName = this.getBucketName(attributes, vars, containerList);
		var parentRecord = this._getParentRecord(bucketName, vars);
		var parentRecordID = parentRecord.getIntId();
		console.log('PARENT ID - ' + parentRecordID);
		var urlVar = '';
		
		//Now find the attachments
		var uploadVar = new FRecord('upload');
		uploadVar.addSearch('record', parentRecordID);
		uploadVar.addSearch('type', 'application/pdf');
		uploadVar.search();
		while (uploadVar.next()) {
			urlVar += '<iframe src="http://localhost:8080/';
			urlVar += uploadVar.url;
			urlVar += '" style="width:100%; height:700px;" frameborder="1" scrolling="auto"></iframe>';
			
			console.log('FOUND ATTACHMENT - ' + urlVar);

		}
		
		return new StatusResponse('good', {
			label: "PDFViewer",
			parentRecord: parentRecord.toJSON(),
			parentRecordId: parentRecord.getIntId(),
			parentRecordDisplayValue: parentRecord.getRecordDisplayValue(),
			url: urlVar
		});
	},
	
	_getParentRecord: function(bucketName, vars) {
		var query = vars.parms['q'];
		var newRecord = Object.isTrue(vars.parms['new']);
		
		var record = new FRecord(bucketName);
		record.setSecurityChecks(true);
		
		if (newRecord) {
			record.newRecord();
			
			if (!Object.isNil(query))
				record.setValues(query);
		} else if (!Object.isNil(query)) {
			record.addEncodedSearch(query);
			record.search();
			record.next();
		}
		
		return record;
	},
	
	className: "PDFViewerServer"
});

module.exports = PDFViewerServer;
