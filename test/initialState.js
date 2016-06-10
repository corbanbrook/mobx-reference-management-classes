export default {
  "hubs": {
    "collection": [
      {
        "type": "hub",
        "id": 123,
        "name": "My First Hub",
        "user": {
          "id": 789
        }
      }
    ]
  },
  "users": {
    "collection": [
      {
        "type": "user",
        "id": 789,
        "firstName": "Corban",
        "lastName": "Brook"
      },
      {
        "type": "user",
        "id": 72,
        "firstName": "Peter",
        "lastName": "Kieltyka"
      }
    ]
  },
  "posts": {
    "collection": [
      {
        "type": "post",
        "id": 456,
        "name": "The Art of Web Programming",
        "hub": {
          "id": 123
        },
        "user": {
          "id": 789
        },
        "children": [
          {
            "type": "video",
            "id": 987,
            "name": "Best of Youtube 2016",
            "hub": {
              "id": 123
            },
            "user": {
              "id": 789
            }
          }
        ],
        "contributions": []
      },
      {
        "type": "post",
        "id": 999,
        "name": "Awesome time",
        "hub": {
          "id": 123
        },
        "user": {
          "id": 789
        },
        "children": [],
        "contributions": [
          {
            "type": "contribution",
            "id": 929,
            "user": {
              "id": 72
            },
            "body": "FUCK YEAH"
          }
        ]
      }
    ]
  }
}
