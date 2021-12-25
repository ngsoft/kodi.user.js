/** 
 * langcode.js 
 * @link https://datahub.io/core/language-codes
 */
(function (root, factory) {
    /* globals define, require, module, self, exports */
    let name = 'langcodes', deps = ['utils'];
    if (typeof define === 'function' && define.amd) {
        define(name, deps, factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        module.exports = factory(...deps.map(d => require(d)));
    } else {
        root[name] = factory(...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function (utils, undef) {


    const { isString, isEmpty, clone } = utils;

    const
        database = [
            {
                name: "Afrikaans",
                alt: [],
                alpha2: "af",
                alpha3: "afr",
                tags: [
                    "af-NA",
                    "af-ZA"
                ]
            },
            {
                name: "Akan",
                alt: [],
                alpha2: "ak",
                alpha3: "aka",
                tags: [
                    "ak-GH"
                ]
            },
            {
                name: "Albanian",
                alt: [],
                alpha2: "sq",
                alpha3: "alb",
                tags: [
                    "sq-AL",
                    "sq-MK",
                    "sq-XK"
                ]
            },
            {
                name: "Amharic",
                alt: [],
                alpha2: "am",
                alpha3: "amh",
                tags: [
                    "am-ET"
                ]
            },
            {
                name: "Arabic",
                alt: [],
                alpha2: "ar",
                alpha3: "ara",
                tags: [
                    "ar-001",
                    "ar-AE",
                    "ar-BH",
                    "ar-DJ",
                    "ar-DZ",
                    "ar-EG",
                    "ar-EH",
                    "ar-ER",
                    "ar-IL",
                    "ar-IQ",
                    "ar-JO",
                    "ar-KM",
                    "ar-KW",
                    "ar-LB",
                    "ar-LY",
                    "ar-MA",
                    "ar-MR",
                    "ar-OM",
                    "ar-PS",
                    "ar-QA",
                    "ar-SA",
                    "ar-SD",
                    "ar-SO",
                    "ar-SS",
                    "ar-SY",
                    "ar-TD",
                    "ar-TN",
                    "ar-YE"
                ]
            },
            {
                name: "Armenian",
                alt: [],
                alpha2: "hy",
                alpha3: "arm",
                tags: [
                    "hy-AM"
                ]
            },
            {
                name: "Assamese",
                alt: [],
                alpha2: "as",
                alpha3: "asm",
                tags: [
                    "as-IN"
                ]
            },
            {
                name: "Azerbaijani",
                alt: [],
                alpha2: "az",
                alpha3: "aze",
                tags: [
                    "az-Cyrl",
                    "az-Latn"
                ]
            },
            {
                name: "Bambara",
                alt: [],
                alpha2: "bm",
                alpha3: "bam",
                tags: [
                    "bm-ML"
                ]
            },
            {
                name: "Basque",
                alt: [],
                alpha2: "eu",
                alpha3: "baq",
                tags: [
                    "eu-ES"
                ]
            },
            {
                name: "Belarusian",
                alt: [],
                alpha2: "be",
                alpha3: "bel",
                tags: [
                    "be-BY"
                ]
            },
            {
                name: "Bengali",
                alt: [],
                alpha2: "bn",
                alpha3: "ben",
                tags: [
                    "bn-BD",
                    "bn-IN"
                ]
            },
            {
                name: "Bosnian",
                alt: [],
                alpha2: "bs",
                alpha3: "bos",
                tags: [
                    "bs-Cyrl",
                    "bs-Latn"
                ]
            },
            {
                name: "Breton",
                alt: [],
                alpha2: "br",
                alpha3: "bre",
                tags: [
                    "br-FR"
                ]
            },
            {
                name: "Bulgarian",
                alt: [],
                alpha2: "bg",
                alpha3: "bul",
                tags: [
                    "bg-BG"
                ]
            },
            {
                name: "Burmese",
                alt: [],
                alpha2: "my",
                alpha3: "bur",
                tags: [
                    "my-MM"
                ]
            },
            {
                name: "Catalan",
                alt: [
                    "Valencian"
                ],
                alpha2: "ca",
                alpha3: "cat",
                tags: [
                    "ca-AD",
                    "ca-ES",
                    "ca-FR",
                    "ca-IT"
                ]
            },
            {
                name: "Chechen",
                alt: [],
                alpha2: "ce",
                alpha3: "che",
                tags: [
                    "ce-RU"
                ]
            },
            {
                name: "Chinese",
                alt: [],
                alpha2: "zh",
                alpha3: "chi",
                tags: [
                    "zh-Hans",
                    "zh-Hant"
                ]
            },
            {
                name: "Church Slavic",
                alt: [
                    "Old Slavonic",
                    "Church Slavonic",
                    "Old Bulgarian",
                    "Old Church Slavonic"
                ],
                alpha2: "cu",
                alpha3: "chu",
                tags: [
                    "cu-RU"
                ]
            },
            {
                name: "Cornish",
                alt: [],
                alpha2: "kw",
                alpha3: "cor",
                tags: [
                    "kw-GB"
                ]
            },
            {
                name: "Czech",
                alt: [],
                alpha2: "cs",
                alpha3: "cze",
                tags: [
                    "cs-CZ"
                ]
            },
            {
                name: "Danish",
                alt: [],
                alpha2: "da",
                alpha3: "dan",
                tags: [
                    "da-DK",
                    "da-GL"
                ]
            },
            {
                name: "Dutch",
                alt: [
                    "Flemish"
                ],
                alpha2: "nl",
                alpha3: "dut",
                tags: [
                    "nl-AW",
                    "nl-BE",
                    "nl-BQ",
                    "nl-CW",
                    "nl-NL",
                    "nl-SR",
                    "nl-SX"
                ]
            },
            {
                name: "Dzongkha",
                alt: [],
                alpha2: "dz",
                alpha3: "dzo",
                tags: [
                    "dz-BT"
                ]
            },
            {
                name: "English",
                alt: [],
                alpha2: "en",
                alpha3: "eng",
                tags: [
                    "en-001",
                    "en-150",
                    "en-AE",
                    "en-AG",
                    "en-AI",
                    "en-AS",
                    "en-AT",
                    "en-AU",
                    "en-BB",
                    "en-BE",
                    "en-BI",
                    "en-BM",
                    "en-BS",
                    "en-BW",
                    "en-BZ",
                    "en-CA",
                    "en-CC",
                    "en-CH",
                    "en-CK",
                    "en-CM",
                    "en-CX",
                    "en-CY",
                    "en-DE",
                    "en-DG",
                    "en-DK",
                    "en-DM",
                    "en-ER",
                    "en-FI",
                    "en-FJ",
                    "en-FK",
                    "en-FM",
                    "en-GB",
                    "en-GD",
                    "en-GG",
                    "en-GH",
                    "en-GI",
                    "en-GM",
                    "en-GU",
                    "en-GY",
                    "en-HK",
                    "en-IE",
                    "en-IL",
                    "en-IM",
                    "en-IN",
                    "en-IO",
                    "en-JE",
                    "en-JM",
                    "en-KE",
                    "en-KI",
                    "en-KN",
                    "en-KY",
                    "en-LC",
                    "en-LR",
                    "en-LS",
                    "en-MG",
                    "en-MH",
                    "en-MO",
                    "en-MP",
                    "en-MS",
                    "en-MT",
                    "en-MU",
                    "en-MW",
                    "en-MY",
                    "en-NA",
                    "en-NF",
                    "en-NG",
                    "en-NL",
                    "en-NR",
                    "en-NU",
                    "en-NZ",
                    "en-PG",
                    "en-PH",
                    "en-PK",
                    "en-PN",
                    "en-PR",
                    "en-PW",
                    "en-RW",
                    "en-SB",
                    "en-SC",
                    "en-SD",
                    "en-SE",
                    "en-SG",
                    "en-SH",
                    "en-SI",
                    "en-SL",
                    "en-SS",
                    "en-SX",
                    "en-SZ",
                    "en-TC",
                    "en-TK",
                    "en-TO",
                    "en-TT",
                    "en-TV",
                    "en-TZ",
                    "en-UG",
                    "en-UM",
                    "en-US",
                    "en-VC",
                    "en-VG",
                    "en-VI",
                    "en-VU",
                    "en-WS",
                    "en-ZA",
                    "en-ZM",
                    "en-ZW"
                ]
            },
            {
                name: "Esperanto",
                alt: [],
                alpha2: "eo",
                alpha3: "epo",
                tags: [
                    "eo-001"
                ]
            },
            {
                name: "Estonian",
                alt: [],
                alpha2: "et",
                alpha3: "est",
                tags: [
                    "et-EE"
                ]
            },
            {
                name: "Ewe",
                alt: [],
                alpha2: "ee",
                alpha3: "ewe",
                tags: [
                    "ee-GH",
                    "ee-TG"
                ]
            },
            {
                name: "Faroese",
                alt: [],
                alpha2: "fo",
                alpha3: "fao",
                tags: [
                    "fo-DK",
                    "fo-FO"
                ]
            },
            {
                name: "Finnish",
                alt: [],
                alpha2: "fi",
                alpha3: "fin",
                tags: [
                    "fi-FI"
                ]
            },
            {
                name: "French",
                alt: [],
                alpha2: "fr",
                alpha3: "fre",
                tags: [
                    "fr-BE",
                    "fr-BF",
                    "fr-BI",
                    "fr-BJ",
                    "fr-BL",
                    "fr-CA",
                    "fr-CD",
                    "fr-CF",
                    "fr-CG",
                    "fr-CH",
                    "fr-CI",
                    "fr-CM",
                    "fr-DJ",
                    "fr-DZ",
                    "fr-FR",
                    "fr-GA",
                    "fr-GF",
                    "fr-GN",
                    "fr-GP",
                    "fr-GQ",
                    "fr-HT",
                    "fr-KM",
                    "fr-LU",
                    "fr-MA",
                    "fr-MC",
                    "fr-MF",
                    "fr-MG",
                    "fr-ML",
                    "fr-MQ",
                    "fr-MR",
                    "fr-MU",
                    "fr-NC",
                    "fr-NE",
                    "fr-PF",
                    "fr-PM",
                    "fr-RE",
                    "fr-RW",
                    "fr-SC",
                    "fr-SN",
                    "fr-SY",
                    "fr-TD",
                    "fr-TG",
                    "fr-TN",
                    "fr-VU",
                    "fr-WF",
                    "fr-YT"
                ]
            },
            {
                name: "Western Frisian",
                alt: [],
                alpha2: "fy",
                alpha3: "fry",
                tags: [
                    "fy-NL"
                ]
            },
            {
                name: "Fulah",
                alt: [],
                alpha2: "ff",
                alpha3: "ful",
                tags: [
                    "ff-Adlm",
                    "ff-Latn"
                ]
            },
            {
                name: "Georgian",
                alt: [],
                alpha2: "ka",
                alpha3: "geo",
                tags: [
                    "ka-GE"
                ]
            },
            {
                name: "German",
                alt: [],
                alpha2: "de",
                alpha3: "ger",
                tags: [
                    "de-AT",
                    "de-BE",
                    "de-CH",
                    "de-DE",
                    "de-IT",
                    "de-LI",
                    "de-LU"
                ]
            },
            {
                name: "Gaelic",
                alt: [
                    "Scottish Gaelic"
                ],
                alpha2: "gd",
                alpha3: "gla",
                tags: [
                    "gd-GB"
                ]
            },
            {
                name: "Irish",
                alt: [],
                alpha2: "ga",
                alpha3: "gle",
                tags: [
                    "ga-GB",
                    "ga-IE"
                ]
            },
            {
                name: "Galician",
                alt: [],
                alpha2: "gl",
                alpha3: "glg",
                tags: [
                    "gl-ES"
                ]
            },
            {
                name: "Manx",
                alt: [],
                alpha2: "gv",
                alpha3: "glv",
                tags: [
                    "gv-IM"
                ]
            },
            {
                name: "Greek, Modern",
                alt: [],
                alpha2: "el",
                alpha3: "gre",
                tags: [
                    "el-CY",
                    "el-GR"
                ]
            },
            {
                name: "Gujarati",
                alt: [],
                alpha2: "gu",
                alpha3: "guj",
                tags: [
                    "gu-IN"
                ]
            },
            {
                name: "Hausa",
                alt: [],
                alpha2: "ha",
                alpha3: "hau",
                tags: [
                    "ha-GH",
                    "ha-NE",
                    "ha-NG"
                ]
            },
            {
                name: "Hebrew",
                alt: [],
                alpha2: "he",
                alpha3: "heb",
                tags: [
                    "he-IL"
                ]
            },
            {
                name: "Hindi",
                alt: [],
                alpha2: "hi",
                alpha3: "hin",
                tags: [
                    "hi-IN"
                ]
            },
            {
                name: "Croatian",
                alt: [],
                alpha2: "hr",
                alpha3: "hrv",
                tags: [
                    "hr-BA",
                    "hr-HR"
                ]
            },
            {
                name: "Hungarian",
                alt: [],
                alpha2: "hu",
                alpha3: "hun",
                tags: [
                    "hu-HU"
                ]
            },
            {
                name: "Igbo",
                alt: [],
                alpha2: "ig",
                alpha3: "ibo",
                tags: [
                    "ig-NG"
                ]
            },
            {
                name: "Icelandic",
                alt: [],
                alpha2: "is",
                alpha3: "ice",
                tags: [
                    "is-IS"
                ]
            },
            {
                name: "Sichuan Yi",
                alt: [
                    "Nuosu"
                ],
                alpha2: "ii",
                alpha3: "iii",
                tags: [
                    "ii-CN"
                ]
            },
            {
                name: "Interlingua",
                alt: [],
                alpha2: "ia",
                alpha3: "ina",
                tags: [
                    "ia-001"
                ]
            },
            {
                name: "Indonesian",
                alt: [],
                alpha2: "id",
                alpha3: "ind",
                tags: [
                    "id-ID"
                ]
            },
            {
                name: "Italian",
                alt: [],
                alpha2: "it",
                alpha3: "ita",
                tags: [
                    "it-CH",
                    "it-IT",
                    "it-SM",
                    "it-VA"
                ]
            },
            {
                name: "Javanese",
                alt: [],
                alpha2: "jv",
                alpha3: "jav",
                tags: [
                    "jv-ID"
                ]
            },
            {
                name: "Japanese",
                alt: [],
                alpha2: "ja",
                alpha3: "jpn",
                tags: [
                    "ja-JP"
                ]
            },
            {
                name: "Kalaallisut",
                alt: [
                    "Greenlandic"
                ],
                alpha2: "kl",
                alpha3: "kal",
                tags: [
                    "kl-GL"
                ]
            },
            {
                name: "Kannada",
                alt: [],
                alpha2: "kn",
                alpha3: "kan",
                tags: [
                    "kn-IN"
                ]
            },
            {
                name: "Kashmiri",
                alt: [],
                alpha2: "ks",
                alpha3: "kas",
                tags: [
                    "ks-Arab"
                ]
            },
            {
                name: "Kazakh",
                alt: [],
                alpha2: "kk",
                alpha3: "kaz",
                tags: [
                    "kk-KZ"
                ]
            },
            {
                name: "Central Khmer",
                alt: [],
                alpha2: "km",
                alpha3: "khm",
                tags: [
                    "km-KH"
                ]
            },
            {
                name: "Kikuyu",
                alt: [
                    "Gikuyu"
                ],
                alpha2: "ki",
                alpha3: "kik",
                tags: [
                    "ki-KE"
                ]
            },
            {
                name: "Kinyarwanda",
                alt: [],
                alpha2: "rw",
                alpha3: "kin",
                tags: [
                    "rw-RW"
                ]
            },
            {
                name: "Kirghiz",
                alt: [
                    "Kyrgyz"
                ],
                alpha2: "ky",
                alpha3: "kir",
                tags: [
                    "ky-KG"
                ]
            },
            {
                name: "Korean",
                alt: [],
                alpha2: "ko",
                alpha3: "kor",
                tags: [
                    "ko-KP",
                    "ko-KR"
                ]
            },
            {
                name: "Kurdish",
                alt: [],
                alpha2: "ku",
                alpha3: "kur",
                tags: [
                    "ku-TR"
                ]
            },
            {
                name: "Lao",
                alt: [],
                alpha2: "lo",
                alpha3: "lao",
                tags: [
                    "lo-LA"
                ]
            },
            {
                name: "Latvian",
                alt: [],
                alpha2: "lv",
                alpha3: "lav",
                tags: [
                    "lv-LV"
                ]
            },
            {
                name: "Lingala",
                alt: [],
                alpha2: "ln",
                alpha3: "lin",
                tags: [
                    "ln-AO",
                    "ln-CD",
                    "ln-CF",
                    "ln-CG"
                ]
            },
            {
                name: "Lithuanian",
                alt: [],
                alpha2: "lt",
                alpha3: "lit",
                tags: [
                    "lt-LT"
                ]
            },
            {
                name: "Luxembourgish",
                alt: [
                    "Letzeburgesch"
                ],
                alpha2: "lb",
                alpha3: "ltz",
                tags: [
                    "lb-LU"
                ]
            },
            {
                name: "Luba-Katanga",
                alt: [],
                alpha2: "lu",
                alpha3: "lub",
                tags: [
                    "lu-CD"
                ]
            },
            {
                name: "Ganda",
                alt: [],
                alpha2: "lg",
                alpha3: "lug",
                tags: [
                    "lg-UG"
                ]
            },
            {
                name: "Macedonian",
                alt: [],
                alpha2: "mk",
                alpha3: "mac",
                tags: [
                    "mk-MK"
                ]
            },
            {
                name: "Malayalam",
                alt: [],
                alpha2: "ml",
                alpha3: "mal",
                tags: [
                    "ml-IN"
                ]
            },
            {
                name: "Maori",
                alt: [],
                alpha2: "mi",
                alpha3: "mao",
                tags: [
                    "mi-NZ"
                ]
            },
            {
                name: "Marathi",
                alt: [],
                alpha2: "mr",
                alpha3: "mar",
                tags: [
                    "mr-IN"
                ]
            },
            {
                name: "Malay",
                alt: [],
                alpha2: "ms",
                alpha3: "may",
                tags: [
                    "ms-BN",
                    "ms-ID",
                    "ms-MY",
                    "ms-SG"
                ]
            },
            {
                name: "Malagasy",
                alt: [],
                alpha2: "mg",
                alpha3: "mlg",
                tags: [
                    "mg-MG"
                ]
            },
            {
                name: "Maltese",
                alt: [],
                alpha2: "mt",
                alpha3: "mlt",
                tags: [
                    "mt-MT"
                ]
            },
            {
                name: "Mongolian",
                alt: [],
                alpha2: "mn",
                alpha3: "mon",
                tags: [
                    "mn-MN"
                ]
            },
            {
                name: "Ndebele, North",
                alt: [
                    "North Ndebele"
                ],
                alpha2: "nd",
                alpha3: "nde",
                tags: [
                    "nd-ZW"
                ]
            },
            {
                name: "Nepali",
                alt: [],
                alpha2: "ne",
                alpha3: "nep",
                tags: [
                    "ne-IN",
                    "ne-NP"
                ]
            },
            {
                name: "Norwegian Nynorsk",
                alt: [
                    "Nynorsk, Norwegian"
                ],
                alpha2: "nn",
                alpha3: "nno",
                tags: [
                    "nn-NO"
                ]
            },
            {
                name: "Bokm\u00e5l, Norwegian",
                alt: [
                    "Norwegian Bokm\u00e5l"
                ],
                alpha2: "nb",
                alpha3: "nob",
                tags: [
                    "nb-NO",
                    "nb-SJ"
                ]
            },
            {
                name: "Oriya",
                alt: [],
                alpha2: "or",
                alpha3: "ori",
                tags: [
                    "or-IN"
                ]
            },
            {
                name: "Oromo",
                alt: [],
                alpha2: "om",
                alpha3: "orm",
                tags: [
                    "om-ET",
                    "om-KE"
                ]
            },
            {
                name: "Ossetian",
                alt: [
                    "Ossetic"
                ],
                alpha2: "os",
                alpha3: "oss",
                tags: [
                    "os-GE",
                    "os-RU"
                ]
            },
            {
                name: "Panjabi",
                alt: [
                    "Punjabi"
                ],
                alpha2: "pa",
                alpha3: "pan",
                tags: [
                    "pa-Arab",
                    "pa-Guru"
                ]
            },
            {
                name: "Persian",
                alt: [],
                alpha2: "fa",
                alpha3: "per",
                tags: [
                    "fa-AF",
                    "fa-IR"
                ]
            },
            {
                name: "Polish",
                alt: [],
                alpha2: "pl",
                alpha3: "pol",
                tags: [
                    "pl-PL"
                ]
            },
            {
                name: "Portuguese",
                alt: [],
                alpha2: "pt",
                alpha3: "por",
                tags: [
                    "pt-AO",
                    "pt-BR",
                    "pt-CH",
                    "pt-CV",
                    "pt-GQ",
                    "pt-GW",
                    "pt-LU",
                    "pt-MO",
                    "pt-MZ",
                    "pt-PT",
                    "pt-ST",
                    "pt-TL"
                ]
            },
            {
                name: "Pushto",
                alt: [
                    "Pashto"
                ],
                alpha2: "ps",
                alpha3: "pus",
                tags: [
                    "ps-AF",
                    "ps-PK"
                ]
            },
            {
                name: "Quechua",
                alt: [],
                alpha2: "qu",
                alpha3: "que",
                tags: [
                    "qu-BO",
                    "qu-EC",
                    "qu-PE"
                ]
            },
            {
                name: "Romansh",
                alt: [],
                alpha2: "rm",
                alpha3: "roh",
                tags: [
                    "rm-CH"
                ]
            },
            {
                name: "Romanian",
                alt: [
                    "Moldavian",
                    "Moldovan"
                ],
                alpha2: "ro",
                alpha3: "rum",
                tags: [
                    "ro-MD",
                    "ro-RO"
                ]
            },
            {
                name: "Rundi",
                alt: [],
                alpha2: "rn",
                alpha3: "run",
                tags: [
                    "rn-BI"
                ]
            },
            {
                name: "Russian",
                alt: [],
                alpha2: "ru",
                alpha3: "rus",
                tags: [
                    "ru-BY",
                    "ru-KG",
                    "ru-KZ",
                    "ru-MD",
                    "ru-RU",
                    "ru-UA"
                ]
            },
            {
                name: "Sango",
                alt: [],
                alpha2: "sg",
                alpha3: "sag",
                tags: [
                    "sg-CF"
                ]
            },
            {
                name: "Sinhala",
                alt: [
                    "Sinhalese"
                ],
                alpha2: "si",
                alpha3: "sin",
                tags: [
                    "si-LK"
                ]
            },
            {
                name: "Slovak",
                alt: [],
                alpha2: "sk",
                alpha3: "slo",
                tags: [
                    "sk-SK"
                ]
            },
            {
                name: "Slovenian",
                alt: [],
                alpha2: "sl",
                alpha3: "slv",
                tags: [
                    "sl-SI"
                ]
            },
            {
                name: "Northern Sami",
                alt: [],
                alpha2: "se",
                alpha3: "sme",
                tags: [
                    "se-FI",
                    "se-NO",
                    "se-SE"
                ]
            },
            {
                name: "Shona",
                alt: [],
                alpha2: "sn",
                alpha3: "sna",
                tags: [
                    "sn-ZW"
                ]
            },
            {
                name: "Sindhi",
                alt: [],
                alpha2: "sd",
                alpha3: "snd",
                tags: [
                    "sd-Arab",
                    "sd-Deva"
                ]
            },
            {
                name: "Somali",
                alt: [],
                alpha2: "so",
                alpha3: "som",
                tags: [
                    "so-DJ",
                    "so-ET",
                    "so-KE",
                    "so-SO"
                ]
            },
            {
                name: "Spanish",
                alt: [
                    "Castilian"
                ],
                alpha2: "es",
                alpha3: "spa",
                tags: [
                    "es-419",
                    "es-AR",
                    "es-BO",
                    "es-BR",
                    "es-BZ",
                    "es-CL",
                    "es-CO",
                    "es-CR",
                    "es-CU",
                    "es-DO",
                    "es-EA",
                    "es-EC",
                    "es-ES",
                    "es-GQ",
                    "es-GT",
                    "es-HN",
                    "es-IC",
                    "es-MX",
                    "es-NI",
                    "es-PA",
                    "es-PE",
                    "es-PH",
                    "es-PR",
                    "es-PY",
                    "es-SV",
                    "es-US",
                    "es-UY",
                    "es-VE"
                ]
            },
            {
                name: "Serbian",
                alt: [],
                alpha2: "sr",
                alpha3: "srp",
                tags: [
                    "sr-Cyrl",
                    "sr-Latn"
                ]
            },
            {
                name: "Sundanese",
                alt: [],
                alpha2: "su",
                alpha3: "sun",
                tags: [
                    "su-Latn"
                ]
            },
            {
                name: "Swahili",
                alt: [],
                alpha2: "sw",
                alpha3: "swa",
                tags: [
                    "sw-CD",
                    "sw-KE",
                    "sw-TZ",
                    "sw-UG"
                ]
            },
            {
                name: "Swedish",
                alt: [],
                alpha2: "sv",
                alpha3: "swe",
                tags: [
                    "sv-AX",
                    "sv-FI",
                    "sv-SE"
                ]
            },
            {
                name: "Tamil",
                alt: [],
                alpha2: "ta",
                alpha3: "tam",
                tags: [
                    "ta-IN",
                    "ta-LK",
                    "ta-MY",
                    "ta-SG"
                ]
            },
            {
                name: "Tatar",
                alt: [],
                alpha2: "tt",
                alpha3: "tat",
                tags: [
                    "tt-RU"
                ]
            },
            {
                name: "Telugu",
                alt: [],
                alpha2: "te",
                alpha3: "tel",
                tags: [
                    "te-IN"
                ]
            },
            {
                name: "Tajik",
                alt: [],
                alpha2: "tg",
                alpha3: "tgk",
                tags: [
                    "tg-TJ"
                ]
            },
            {
                name: "Thai",
                alt: [],
                alpha2: "th",
                alpha3: "tha",
                tags: [
                    "th-TH"
                ]
            },
            {
                name: "Tibetan",
                alt: [],
                alpha2: "bo",
                alpha3: "tib",
                tags: [
                    "bo-CN",
                    "bo-IN"
                ]
            },
            {
                name: "Tigrinya",
                alt: [],
                alpha2: "ti",
                alpha3: "tir",
                tags: [
                    "ti-ER",
                    "ti-ET"
                ]
            },
            {
                name: "Tonga",
                alt: [],
                alpha2: "to",
                alpha3: "ton",
                tags: [
                    "to-TO"
                ]
            },
            {
                name: "Turkmen",
                alt: [],
                alpha2: "tk",
                alpha3: "tuk",
                tags: [
                    "tk-TM"
                ]
            },
            {
                name: "Turkish",
                alt: [],
                alpha2: "tr",
                alpha3: "tur",
                tags: [
                    "tr-CY",
                    "tr-TR"
                ]
            },
            {
                name: "Uighur",
                alt: [
                    "Uyghur"
                ],
                alpha2: "ug",
                alpha3: "uig",
                tags: [
                    "ug-CN"
                ]
            },
            {
                name: "Ukrainian",
                alt: [],
                alpha2: "uk",
                alpha3: "ukr",
                tags: [
                    "uk-UA"
                ]
            },
            {
                name: "Urdu",
                alt: [],
                alpha2: "ur",
                alpha3: "urd",
                tags: [
                    "ur-IN",
                    "ur-PK"
                ]
            },
            {
                name: "Uzbek",
                alt: [],
                alpha2: "uz",
                alpha3: "uzb",
                tags: [
                    "uz-Arab",
                    "uz-Cyrl",
                    "uz-Latn"
                ]
            },
            {
                name: "Vietnamese",
                alt: [],
                alpha2: "vi",
                alpha3: "vie",
                tags: [
                    "vi-VN"
                ]
            },
            {
                name: "Volap\u00fck",
                alt: [],
                alpha2: "vo",
                alpha3: "vol",
                tags: [
                    "vo-001"
                ]
            },
            {
                name: "Welsh",
                alt: [],
                alpha2: "cy",
                alpha3: "wel",
                tags: [
                    "cy-GB"
                ]
            },
            {
                name: "Wolof",
                alt: [],
                alpha2: "wo",
                alpha3: "wol",
                tags: [
                    "wo-SN"
                ]
            },
            {
                name: "Xhosa",
                alt: [],
                alpha2: "xh",
                alpha3: "xho",
                tags: [
                    "xh-ZA"
                ]
            },
            {
                name: "Yiddish",
                alt: [],
                alpha2: "yi",
                alpha3: "yid",
                tags: [
                    "yi-001"
                ]
            },
            {
                name: "Yoruba",
                alt: [],
                alpha2: "yo",
                alpha3: "yor",
                tags: [
                    "yo-BJ",
                    "yo-NG"
                ]
            },
            {
                name: "Zulu",
                alt: [],
                alpha2: "zu",
                alpha3: "zul",
                tags: [
                    "zu-ZA"
                ]
            }
        ],
        und = {
            name: "Undetermined",
            alt: [],
            alpha2: "und",
            alpha3: "und",
            tags: []
        },
        map2 = new Map(),
        map3 = new Map(),
        map = new Map(),
        mapTags = new Map(),
        RE_TAGS = /^\w+-\w+$/;
    // creates Maps
    database.forEach(item => {
        map2.set(item.alpha2, item);
        map3.set(item.alpha3, item);
        map.set(item.name.toLowerCase(), item);
        item.alt.forEach(name => map.set(name.toLowerCase(), item));
        item.tags.forEach(tag => mapTags.set(tag.toLowerCase(), item));
    });



    /**
     * Find a lang
     * @param {string} lang 
     * @returns {Promise} 
     */
    async function find(lang) {

        if (!isString(lang) || isEmpty(lang)) {
            throw new Error('invalid argument lang: not a string');
        }

        let len = lang.length, result = und, lower = lang.toLowerCase();
        if (len === 2)
            result = clone(map2.get(lower) || result);
        else if (len === 3)
            result = clone(map3.get(lower) || result);
        else if (RE_TAGS.test(lower))
            result = clone(mapTags.get(lower) || result);
        else
            result = clone(map.get(lower) || result);

        return result;
    }

    Object.assign(find, { database, map, map2, map3, mapTags })

    return find;


}));