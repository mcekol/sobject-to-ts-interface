const parser = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');
const parseArgs = require('minimist');

const options = {
	attributeNamePrefix: "@_",
	attrNodeName: "attr", // default is 'false'
	textNodeName: "#text",
	ignoreAttributes: true,
	ignoreNameSpace: false,
	allowBooleanAttributes: false,
	parseNodeValue: true,
	parseAttributeValue: false,
	trimValues: true,
	cdataTagName: "__cdata", // default is 'false'
	cdataPositionChar: "\\c",
	localeRange: "", // to support non english character in tag/attribute values.
	parseTrueNumberOnly: false,
	stopNodes: ["parse-me-as-string"]
};

function toTsType(t) {
	const lowerCaseT = t.toLowerCase();
	switch (lowerCaseT) {
		case 'longtextarea':
		case 'lookup':
		case 'masterdetail':
		case 'picklist':
		case 'text':
		case 'textarea': {
			return 'string';
		}
		case 'checkbox': {
			return 'boolean';
		}
		case 'currency':
		case 'number': {
			return 'number';
		}
		default: {
			return t;
		}
	}
}

function createInterfaceString(obj) {
	return `interface ${obj.label.replace(/\s/gmi, '_')}__c {\n` +
		obj.fields
		.sort((a,b) => { return ('' + a.fullName).localeCompare(b.fullName); }) // sort by fullName ASC
		.map(field => {
			return `\t${field.fullName}: ${toTsType(field.type)};`
		}).join('\n') +
		'\n}';
}

function parseData(xmlData) {
	const jsonObj = parser.parse(xmlData, options);

	return jsonObj[Object.keys(jsonObj)[0]];
}

const args = parseArgs(process.argv.slice(2));
const fileNames = args['_'];
const writeToFile = args['w'];

fileNames.forEach(fileName => {
	const xmlData = fs.readFileSync(path.join(__dirname, fileName), 'UTF-8');

	if (parser.validate(xmlData) === true) {
		const obj = parseData(xmlData);
		const str = createInterfaceString(obj);

		if (writeToFile) {
			fs.writeFileSync(path.join(__dirname, fileName.replace('.object', '.ts')), str, 'UTF-8');
		}

		console.log(str + '\n');
	} else {
		console.error(`Invalid xml file: ${fileName}`);
	}
});


