##树形结构

template/
root.json
    {
      "role":"root",
      "isBottom":false,
      "next":[
          "normal/normal.json",
          "manual/manual.json"
        ],
      "childrenNumber":2
    }

    normal/
    {
      "role":"class",
      "isBottom":false,
      "next":[
          "normal/chinese/chinese.json",
           "normal/flat.flat.json"
        ],
      "father":"root.json",
      "childrenNumber":2
    }

            chinese/
            {
              "role":"master",
              "isBottom":false,
              "next":[

                  "normal/chinese/mainThumbnail/list.json",
                "normal/chinese/colorset/list.json",
                  "normal/chinese/original/list.json"
                ],
              "father":"normal/normal.json",
              "childrenNumber":3
            }

                    mainThumbnail/
                    {
                      "role":"list",
                      "isBottom":true,
                      "items":["templates/normal/chinese/mainThumbnail/demo.json"],
                      "name":"mainThumbnail",
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
