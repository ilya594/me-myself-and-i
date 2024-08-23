import { XMLParser, XMLBuilder, XMLValidator} from "fast-xml-parser";

export class XmlGenerator {

    static builder = new XMLBuilder();

    static parser = new XMLParser();

    static convertObjectToXml = (object: Object): any => {
        return XmlGenerator.builder.build(object);
    }

    static convertXmlToObject = (xml: any): Object => {
        return XmlGenerator.parser.parse(xml);
    }

    static convertJsonToXml = (json: string): any => {
        let object;
        try {
            object = JSON.parse(json);
        } catch (error: any) {
            // convertion failed
        }
        return object ? XmlGenerator.convertObjectToXml(object) : null;
    }
}