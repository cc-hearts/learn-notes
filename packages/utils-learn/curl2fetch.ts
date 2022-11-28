// @ts-ignore
import { writeFileSync } from "fs";


function getRequestTitle(curl: string): string {
    const reg = /curl\s*\'(.*?)'/;
    const requestTitle = curl.match(reg);
    if (requestTitle === null) throw new Error("error curl request");
    return requestTitle && requestTitle[1];
}

function getHeader(curl: string): Record<string, unknown> {
    const reg = /-H\s*\'(.*?)\'/g;
    const data = curl.match(reg);
    if (data === null) throw new Error("error curl header");
    const headerMatch = /(?<=\')(.*)(?=\')/g;
    return data.reduce((acc, cur) => {
        const matcher = cur.match(headerMatch);
        if (matcher) {
            const [m] = matcher;
            const [key, value] = m.split(/\:\s/);
            acc[key.trim()] = value.trim();
        }
        return acc;
    }, {});
}

function getBody(curl: string): string {
    const reg = /--data-raw\s*\'(.*?)\'|--data\s*\'(.*?)\'/;
    const data = curl.match(reg);
    return (data && data[1]) || "";
}

function getMethods(curl: string): string {
    const reg = /--data\s*/g;
    return reg.test(curl) ? "POST" : "GET";
}

function bootstrap(curl:string) {
    const title = getRequestTitle(curl);
    const header = getHeader(curl);
    const body = getBody(curl);
    const methods = getMethods(curl);
    return `fetch('${title}', {
    method: '${methods}',
    headers: ${JSON.stringify(header, null, 6)},
    body: '${body}'
  })
  `;
}
