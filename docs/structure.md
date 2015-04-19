##树形结构

template/
root.json
    {
        "role":"root",
        "isBottom":false,
        "next":[
            "normalTemplates":"normal/normal.json",
            "userTemplates":"manual/manual.json"
            ],
        "childrenNumber":2
    }

    normal/
    normal.json
    {
        "role":"class",
        "isBottom":false,
        "next":[
        "chinese":"normal/chinese/chinese.json",
        "flat":"normal/flat.flat.json"
        ],
        "father":"root.json",
        "childrenNumber":2
    }

            chinese/
            chinese.json
            {
                "role":"master",
                "isBottom":false,
                "next":[
                "mainThumbnail":"normal/chinese/mainThumbnail/list.json",
                "colorset":"normal/chinese/colorset/list.json",
                "original":"normal/chinese/original/list.json"
                ]
                "father":"normal/normal.json",
                "childrenNumber":3
            }

                    mainThumbnail/
                    list.json
                    {
                        "role":"list",
                        "name"="mainThumbnail",
                        "isBottom":true,
                        "items":["main.png"],
                        "father":"normal/chinese/chinese.json"
                    }


    manual/
        manual.json
        {
            "role":"class",
            "isBottom":false,
            "next":[
            ],
            "childrenNumber":0
        }
