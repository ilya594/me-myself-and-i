import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser';


/**
 * usage examples : 
 * 
 * 1. const template = XmlUtil.getActionTemplate('ACCEPT');
 *          template.setField('ANI', some_ANI_value);
 *          template.setField('ExternalReferenceID', some_ExternalReferenceID_value);
 *    const xml = template.toXml();
 *
 *  
 * 2. const template = XmlUtil.getActionTemplate('ACCEPT', {'ANI' : 'some_ANI_value'});
 *    const xml = template.toXml();
 * 
 * 
 * so mainly - you can set keys-values within getActionTemplate injection || using setField (overrides if exists) over the Template instance 
 * 
 */



class Template {

    private payload;

    constructor(payload: any) {
        this.payload = payload;
    }

    public setField = (field: string, value: string): Template => {
        if (XmlUtil.isSimple(value)) {
            this.payload[field] = value;
        } else {
            this.payload[field] = JSON.parse(value);
        }
        return this;
    }

    public toXml = () => {
        return XmlUtil.convertObjectToXml({ payload: this.payload });
    }
}

class TemplateFactory {

    private default: any = {
        Type: 'CALL',
        EventType: 'INBOUND',
    };

    private actions: any = {
        'sap.accept' : 'ACCEPT',
        'sap.notify' : 'NOTIFY',
        'sap.end' : 'END',
        'sap.finish' : 'FINISH',
    }

    public getActionTemplate = (action: string, message: string): Template => {
         return new Template({ ...this.default, ...{ 'ACTION' : this.actions[action] }, ...JSON.parse(message) });
    }
}


export class XmlUtil {

    static builder = new XMLBuilder();

    static parser = new XMLParser();

    static factory = new TemplateFactory();

    static convertObjectToXml = (object: Object): any => {
        return XmlUtil.wrap(XmlUtil.builder.build(object));
    }

    static convertXmlToObject = (xml: any): Object => {
        return XmlUtil.parser.parse(xml);
    }

    static convertJsonToXml = (json: string): any => {
        let object;
        try {
            object = JSON.parse(json);
        } catch (error: any) {
            // convertion failed
        }
        return object ? XmlUtil.convertObjectToXml(object) : null;
    }

    static getActionTemplate = (action: any, message: string = '{}') => {
        return XmlUtil.factory.getActionTemplate(action, message);
    }

    static isValid = (xml: any) => {
        return XMLValidator.validate(xml);
    }

    static isSimple = (value: string): Boolean => {

        if (value === '') return true;

        let result = true;

        try {
            result = JSON.parse(value) && false;
        } catch (error: any) {
            result = true;
        }
        return result;
    }

    static wrap = (xml: any) => {
        return '<?xml version="1.0" encoding="UTF-8"?>' + xml;
    }
}

export default XmlUtil;

