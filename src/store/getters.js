const getters = {
  authz(state) {
    return state.authz;
  },
  user(state) {
    if (state.user) {
      return state.user;
    }
    state.user = {
      "userInfo": {
        "name": "风暴中心",
      },
      "userName": "碧波淼淼",
      "menus": {
        "menus": [
          {
            "menuName": "父",
            "children": [
              {
                "menuName": "子一",
                "children": [
                  {
                    "menuName": "孙一",
                    "menuUrl": "/a",
                    "menuIcon": "fa fa-id-badge",
                    "id": "1",
                    "menuId": "1",
                  },
                  {
                    "menuName": "孙二",
                    "menuUrl": "/one/page-one",
                    "menuIcon": "fa fa-id-badge",
                    "id": "2",
                    "menuId": "2",
                  },
                  {
                    "menuName": "孙三",
                    "menuUrl": "/c",
                    "menuIcon": "fa fa-twitch",
                    "id": "3",
                    "menuId": "3",
                  }
                ],
                "id": "4",
                "menuId": "4",
              },
              {
                "menuName": "子二",
                "menuUrl": "/d",
                "id": "5",
                "menuId": "5",
              }
            ],
            "menuIcon": "fa fa-slideshare",
            "id": "6",
            "menuId": "6",
          },
          {
            "menuName": "父",
            "children": [
              {
                "menuName": "子一",
                "children": [
                  {
                    "menuName": "孙一",
                    "menuUrl": "/a",
                    "menuIcon": "fa fa-id-badge",
                    "id": "11",
                    "menuId": "11",
                  },
                  {
                    "menuName": "孙二",
                    "menuUrl": "/b",
                    "menuIcon": "fa fa-id-badge",
                    "id": "22",
                    "menuId": "22",
                  },
                  {
                    "menuName": "孙三",
                    "menuUrl": "/c",
                    "menuIcon": "fa fa-twitch",
                    "id": "33",
                    "menuId": "33",
                  }
                ],
                "id": "44",
                "menuId": "44",
              },
              {
                "menuName": "子二",
                "menuUrl": "/d",
                "id": "55",
                "menuId": "55",
              }
            ],
            "menuIcon": "fa fa-slideshare",
            "id": "66",
            "menuId": "66",
          }
        ]
      },
    };
    state.authz = true;
    return state.user;
  }
}

export default getters;
