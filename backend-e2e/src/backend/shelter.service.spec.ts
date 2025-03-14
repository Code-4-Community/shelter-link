import { Test, TestingModule } from '@nestjs/testing';
import { ShelterService } from '../../../backend/src/shelter/shelter.service';
import { DynamoDbService } from '../../../backend/src/dynamodb'; // Import your DynamoDB service
import { NewShelterInput } from 'backend/src/dtos/newShelterDTO';
import { ShelterUpdateModel } from 'backend/src/shelter/shelter.model';

const mockDynamoDB = {
    scanTable: jest.fn(),
    getHighestShelterId: jest.fn(),
    postItem: jest.fn(),
    getItem: jest.fn(),
    deleteItem: jest.fn(),
    updateAttributes: jest.fn()
};

const postReqSuccess: NewShelterInput = {
    name: 'Curry Student Center',
    address: {
        street: '360 Huntington Ave',
        city: 'Boston',
        state: 'MA',
        zipCode: '02115',
        country: 'United States',
    },
    latitude: 42.338925,
    longitude: -71.088128,
    description:
        'The John A. and Marcia E. Curry Student Center is the crossroads for community life at Northeastern University, serving all members of the University',
    rating: 4.6,
    phone_number: '617-373-2000',
    email_address: 'cie@northeastern.edu',
    website: 'https://calendar.northeastern.edu/curry_student_center',
    hours: {
        Monday: { opening_time: '07:00', closing_time: '24:00' },
        Tuesday: null,
        Wednesday: { opening_time: '07:00', closing_time: '24:00' },
        Thursday: { opening_time: '07:00', closing_time: '24:00' },
        Friday: { opening_time: '07:00', closing_time: '23:00' },
        Saturday: { opening_time: '08:00', closing_time: '23:00' },
        Sunday: { opening_time: '10:00', closing_time: '24:00' },
    },
    picture: [
        'https://th.bing.com/th/id/OIP.OqpRP8dl-udJN9VAHIiCUQHaE8?rs=1&pid=ImgDetMain',
        'https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd609234077806.56c3572f1b380.jpg',
        'https://www.pcadesign.com/wp-content/uploads/NU-Curry-Dining_5-1536x1114.jpg',
    ],
    availability: '',
};

const postReqZeroFailure = {
    name: postReqSuccess.name,
    address: postReqSuccess.address,
    latitude: postReqSuccess.latitude,
    longitude: postReqSuccess.longitude,
    description: postReqSuccess.description,
    rating: 0,
    phone_number: postReqSuccess.phone_number,
    email_address: postReqSuccess.email_address,
    website: postReqSuccess.website,
    hours: postReqSuccess.hours,
    picture: postReqSuccess.picture,
    availability: postReqSuccess.availability
}

const postSubReqZeroFailure = {
    name: postReqSuccess.name,
    address: postReqSuccess.address,
    latitude: postReqSuccess.latitude,
    longitude: postReqSuccess.longitude,
    description: postReqSuccess.description,
    rating: -1,
    phone_number: postReqSuccess.phone_number,
    email_address: postReqSuccess.email_address,
    website: postReqSuccess.website,
    hours: postReqSuccess.hours,
    picture: postReqSuccess.picture,
    availability: postReqSuccess.availability
}

const postFiveRatingSuccess = {
    name: postReqSuccess.name,
    address: postReqSuccess.address,
    latitude: postReqSuccess.latitude,
    longitude: postReqSuccess.longitude,
    description: postReqSuccess.description,
    rating: 5,
    phone_number: postReqSuccess.phone_number,
    email_address: postReqSuccess.email_address,
    website: postReqSuccess.website,
    hours: postReqSuccess.hours,
    picture: postReqSuccess.picture,
    availability: postReqSuccess.availability
}

const postDynamoDBReqBodySuccess = {
    shelterId: { S: '2' },
    name: { S: 'Curry Student Center' },
    address: {
        M: {
            street: {
                "S": "360 Huntington Ave"
            },
            city: {
                "S": "Boston"
            },
            state: {
                "S": "MA"
            },
            zipCode: {
                "S": "02115"
            },
            country: {
                "S": "United States"
            }
        }
    },
    latitude: { N: '42.338925' },
    longitude: { N: '-71.088128' },
    description: {
        S: 'The John A. and Marcia E. Curry Student Center is the crossroads for community life at Northeastern University, serving all members of the University'
    },
    phone_number: { S: '617-373-2000' },
    email_address: { S: 'cie@northeastern.edu' },
    hours: {
        M: {
            "Monday": {
                "M": {
                    "closing_time": {
                        "S": "24:00",
                    },
                    "opening_time": {
                        "S": "07:00",
                    },
                },
            },
            "Tuesday": null,
            "Wednesday": {
                "M": {
                    "closing_time": {
                        "S": "24:00",
                    },
                    "opening_time": {
                        "S": "07:00",
                    },
                },
            },
            "Thursday": {
                "M": {
                    "closing_time": {
                        "S": "24:00",
                    },
                    "opening_time": {
                        "S": "07:00",
                    },
                },
            },
            "Friday": {
                "M": {
                    "closing_time": {
                        "S": "23:00"
                    },
                    "opening_time": {
                        "S": "07:00"
                    }
                }
            },
            "Saturday": {
                "M": {
                    "closing_time": {
                        "S": "23:00"
                    },
                    "opening_time": {
                        "S": "08:00"
                    }
                }
            },
            "Sunday": {
                "M": {
                    "closing_time": {
                        "S": "24:00",
                    },
                    "opening_time": {
                        "S": "10:00",
                    },
                },
            },
        }
    },
    picture: {
        L: [{ "S": "https://th.bing.com/th/id/OIP.OqpRP8dl-udJN9VAHIiCUQHaE8?rs=1&pid=ImgDetMain" },
        { "S": "https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd609234077806.56c3572f1b380.jpg" },
        { "S": "https://www.pcadesign.com/wp-content/uploads/NU-Curry-Dining_5-1536x1114.jpg" }]
    },
    rating: { N: '4.6' },
    website: { S: 'https://calendar.northeastern.edu/curry_student_center' }
}

const postDynamoDBReqBodyFiveRatingSuccess = {
    shelterId: postDynamoDBReqBodySuccess.shelterId,
    name: postDynamoDBReqBodySuccess.name,
    address: postDynamoDBReqBodySuccess.address,
    latitude: postDynamoDBReqBodySuccess.latitude,
    longitude: postDynamoDBReqBodySuccess.longitude,
    description: postDynamoDBReqBodySuccess.description,
    phone_number: postDynamoDBReqBodySuccess.phone_number,
    email_address: postDynamoDBReqBodySuccess.email_address,
    hours: postDynamoDBReqBodySuccess.hours,
    picture: postDynamoDBReqBodySuccess.picture,
    rating: { N: '5' },
    website: postDynamoDBReqBodySuccess.website
}

const postReturnSuccess = {
    '$metadata': {
        httpStatusCode: 200,
        requestId: 'N1ME4EVFLIRR03DBC07449TFONVV4KQNSO5AEMVJF66Q9ASUAAJG',
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0
    },
    id: 2
};

const getSheltersReqSuccessDynamoDB = [
    {
        "shelterId": { S: "6" },
        "name": { S: "BAGLY" },
        "address": {
            M: {
                "street": { S: "123 Main St" },
                "city": { S: "Boston" },
                "state": { S: "MA" },
                "zipCode": { S: "02108" },
                "country": { S: "" }
            }
        },
        "latitude": { N: 42.3586 },
        "longitude": { N: -71.180367 },
        "description": { S: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
        "phone_number": { S: "555-0123" },
        "email_address": { S: "contact@shelter.org" },
        "hours": {
            M: {
                "Monday": {
                    M: {
                        "opening_time": { S: "06:00" },
                        "closing_time": { S: "20:00" }
                    }
                },
                "Tuesday": {
                    M: {
                        "opening_time": { S: "08:00" },
                        "closing_time": { S: "20:00" }
                    }
                },
                "Wednesday": {
                    M: {
                        "opening_time": { S: "08:00" },
                        "closing_time": { S: "20:00" }
                    }
                },
                "Thursday": {
                    M: {
                        "opening_time": { S: "06:00" },
                        "closing_time": { S: "20:00" }
                    }
                },
                "Friday": {
                    M: {
                        "opening_time": { S: "08:00" },
                        "closing_time": { S: "20:00" }
                    }
                },
                "Saturday": null,
                "Sunday": null
            }
        },
        "picture": {
            L: [
                { S: "https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp" }
            ]
        },
        "rating": { N: 4.5 },
        "website": { S: "https://www.bagly.org/" }
    },
    {
        "shelterId": { S: "11" },
        "name": { S: "BAGLY" },
        "address": {
            M: {
                "street": { S: "123 Main St" },
                "city": { S: "Boston" },
                "state": { S: "MA" },
                "zipCode": { S: "02108" },
                "country": { S: "" }
            }
        },
        "latitude": { N: 42.3586 },
        "longitude": { N: -71.180367 },
        "description": { S: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
        "phone_number": { S: "555-0123" },
        "email_address": { S: "contact@shelter.org" },
        "hours": {
            M: {
                "Monday": {
                    M: {
                        "opening_time": { S: "06:00" },
                        "closing_time": { S: "20:00" }
                    }
                },
                "Tuesday": {
                    M: {
                        "opening_time": { S: "08:00" },
                        "closing_time": { S: "20:00" }
                    }
                },
                "Wednesday": {
                    M: {
                        "opening_time": { S: "08:00" },
                        "closing_time": { S: "20:00" }
                    }
                },
                "Thursday": {
                    M: {
                        "opening_time": { S: "06:00" },
                        "closing_time": { S: "20:00" }
                    }
                },
                "Friday": {
                    M: {
                        "opening_time": { S: "08:00" },
                        "closing_time": { S: "20:00" }
                    }
                },
                "Saturday": null,
                "Sunday": null
            }
        },
        "picture": {
            L: [
                { S: "https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp" }
            ]
        },
        "rating": { N: 4.5 },
        "website": { S: "https://www.bagly.org/" }
    }
];

const getSheltersReqSuccess = [
    {
        "shelterId": "6",
        "name": "BAGLY",
        "address": {
            "street": "123 Main St",
            "city": "Boston",
            "state": "MA",
            "zipCode": "02108",
            "country": ""
        },
        "latitude": 42.3586,
        "longitude": -71.180367,
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "phone_number": "555-0123",
        "email_address": "contact@shelter.org",
        "hours": {
            "Monday": {
                "opening_time": "06:00",
                "closing_time": "20:00"
            },
            "Tuesday": {
                "opening_time": "08:00",
                "closing_time": "20:00"
            },
            "Wednesday": {
                "opening_time": "08:00",
                "closing_time": "20:00"
            },
            "Thursday": {
                "opening_time": "06:00",
                "closing_time": "20:00"
            },
            "Friday": {
                "opening_time": "08:00",
                "closing_time": "20:00"
            },
            "Saturday": null,
            "Sunday": null
        },
        "picture": [
            "https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp"
        ],
        "rating": 4.5,
        "website": "https://www.bagly.org/"
    },
    {
        "shelterId": "11",
        "name": "BAGLY",
        "address": {
            "street": "123 Main St",
            "city": "Boston",
            "state": "MA",
            "zipCode": "02108",
            "country": ""
        },
        "latitude": 42.3586,
        "longitude": -71.180367,
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "phone_number": "555-0123",
        "email_address": "contact@shelter.org",
        "hours": {
            "Monday": {
                "opening_time": "06:00",
                "closing_time": "20:00"
            },
            "Tuesday": {
                "opening_time": "08:00",
                "closing_time": "20:00"
            },
            "Wednesday": {
                "opening_time": "08:00",
                "closing_time": "20:00"
            },
            "Thursday": {
                "opening_time": "06:00",
                "closing_time": "20:00"
            },
            "Friday": {
                "opening_time": "08:00",
                "closing_time": "20:00"
            },
            "Saturday": null,
            "Sunday": null
        },
        "picture": [
            "https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp"
        ],
        "rating": 4.5,
        "website": "https://www.bagly.org/"
    }
];

const getShelterReqSuccessDynamoDB = [{
    "shelterId": { S: "6" },
    "name": { S: "BAGLY" },
    "address": {
        M: {
            "street": { S: "123 Main St" },
            "city": { S: "Boston" },
            "state": { S: "MA" },
            "zipCode": { S: "02108" },
            "country": { S: "" }
        }
    },
    "latitude": { N: 42.3586 },
    "longitude": { N: -71.180367 },
    "description": { S: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    "phone_number": { S: "555-0123" },
    "email_address": { S: "contact@shelter.org" },
    "hours": {
        M: {
            "Monday": {
                M: {
                    "opening_time": { S: "06:00" },
                    "closing_time": { S: "20:00" }
                }
            },
            "Tuesday": {
                M: {
                    "opening_time": { S: "08:00" },
                    "closing_time": { S: "20:00" }
                }
            },
            "Wednesday": {
                M: {
                    "opening_time": { S: "08:00" },
                    "closing_time": { S: "20:00" }
                }
            },
            "Thursday": {
                M: {
                    "opening_time": { S: "06:00" },
                    "closing_time": { S: "20:00" }
                }
            },
            "Friday": {
                M: {
                    "opening_time": { S: "08:00" },
                    "closing_time": { S: "20:00" }
                }
            },
            "Saturday": null,
            "Sunday": null
        }
    },
    "picture": {
        L: [
            { S: "https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp" }
        ]
    },
    "rating": { N: 4.5 },
    "website": { S: "https://www.bagly.org/" }
}]

const getShelterReqSuccess = {
    "shelterId": "6",
    "name": "BAGLY",
    "address": {
        "street": "123 Main St",
        "city": "Boston",
        "state": "MA",
        "zipCode": "02108",
        "country": ""
    },
    "latitude": 42.3586,
    "longitude": -71.180367,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "phone_number": "555-0123",
    "email_address": "contact@shelter.org",
    "hours": {
        "Monday": {
            "opening_time": "06:00",
            "closing_time": "20:00"
        },
        "Tuesday": {
            "opening_time": "08:00",
            "closing_time": "20:00"
        },
        "Wednesday": {
            "opening_time": "08:00",
            "closing_time": "20:00"
        },
        "Thursday": {
            "opening_time": "06:00",
            "closing_time": "20:00"
        },
        "Friday": {
            "opening_time": "08:00",
            "closing_time": "20:00"
        },
        "Saturday": null,
        "Sunday": null
    },
    "picture": [
        "https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp"
    ],
    "rating": 4.5,
    "website": "https://www.bagly.org/"
}

const deleteDynamoDBSuccess = {
    '$metadata': {
        httpStatusCode: 200,
        requestId: '0099KTBH4F6FMEKPK5R0JGKOO7VV4KQNSO5AEMVJF66Q9ASUAAJG',
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0
    }
}

const updateShelterRequestSuccess: ShelterUpdateModel = {
    "name": "Curry Student Center",
    "address": {
        "street": "360 Huntington Ave",
        "city": "Boston",
        "state": "MA",
        "zipCode": "02115",
        "country": "United States"
    },
    "latitude": 42.338925,
    "longitude": -71.088128,
    "description": "The John A. and Marcia E. Curry Student Center is the crossroads for community life at Northeastern University, serving all members of the University",
    "rating": 4.6,
    "phone_number": "617-373-2000",
    "email_address": "cie@northeastern.edu",
    "website": "https://calendar.northeastern.edu/curry_student_center",
    "hours": {
        "Monday": {
            "opening_time": "07:00",
            "closing_time": "24:00"
        },
        "Wednesday": {
            "opening_time": "07:00",
            "closing_time": "24:00"
        },
        "Thursday": {
            "opening_time": "07:00",
            "closing_time": "24:00"
        },
        "Friday": {
            "opening_time": "07:00",
            "closing_time": "23:00"
        },
        "Saturday": {
            "opening_time": "08:00",
            "closing_time": "23:00"
        },
        "Sunday": {
            "opening_time": "10:00",
            "closing_time": "24:00"
        },
        "Tuesday": null
    },
    "picture": ["https://th.bing.com/th/id/OIP.OqpRP8dl-udJN9VAHIiCUQHaE8?rs=1&pid=ImgDetMain", "https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd609234077806.56c3572f1b380.jpg", "https://www.pcadesign.com/wp-content/uploads/NU-Curry-Dining_5-1536x1114.jpg"]
}

const updateShelterRequestSuccessDynamoDb = {
    "result": {
        "$metadata": {
            "httpStatusCode": 200,
            "requestId": "TB2BCGAGMNTSM0U9FONBES4G3BVV4KQNSO5AEMVJF66Q9ASUAAJG",
            "attempts": 1,
            "totalRetryDelay": 0
        },
        "Attributes": {
            "website": {
                "S": "https://calendar.northeastern.edu/curry_student_center"
            },
            "rating": {
                "N": "4.6"
            },
            "longitude": {
                "N": "-71.088128"
            },
            "phone_number": {
                "S": "617-373-2000"
            },
            "address": {
                "M": {
                    "city": {
                        "S": "Boston"
                    },
                    "country": {
                        "S": "United States"
                    },
                    "state": {
                        "S": "MA"
                    },
                    "street": {
                        "S": "360 Huntington Ave"
                    },
                    "zipCode": {
                        "S": "02115"
                    }
                }
            },
            "description": {
                "S": "The John A. and Marcia E. Curry Student Center is the crossroads for community life at Northeastern University, serving all members of the University"
            },
            "hours": {
                "M": {
                    "Friday": {
                        "M": {
                            "closing_time": {
                                "S": "23:00"
                            },
                            "opening_time": {
                                "S": "07:00"
                            }
                        }
                    },
                    "Monday": {
                        "M": {
                            "closing_time": {
                                "S": "24:00"
                            },
                            "opening_time": {
                                "S": "07:00"
                            }
                        }
                    },
                    "Saturday": {
                        "M": {
                            "closing_time": {
                                "S": "23:00"
                            },
                            "opening_time": {
                                "S": "08:00"
                            }
                        }
                    },
                    "Sunday": {
                        "M": {
                            "closing_time": {
                                "S": "24:00"
                            },
                            "opening_time": {
                                "S": "10:00"
                            }
                        }
                    },
                    "Thursday": {
                        "M": {
                            "closing_time": {
                                "S": "24:00"
                            },
                            "opening_time": {
                                "S": "07:00"
                            }
                        }
                    },
                    "Tuesday": {
                        "M": {
                            "closing_time": {
                                "S": "23:00"
                            },
                            "opening_time": {
                                "S": "13:00"
                            }
                        }
                    },
                    "Wednesday": {
                        "M": {
                            "closing_time": {
                                "S": "24:00"
                            },
                            "opening_time": {
                                "S": "07:00"
                            }
                        }
                    }
                }
            },
            "picture": {
                "L": [
                    {
                        "S": "https://th.bing.com/th/id/OIP.OqpRP8dl-udJN9VAHIiCUQHaE8?rs=1&pid=ImgDetMain"
                    },
                    {
                        "S": "https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd609234077806.56c3572f1b380.jpg"
                    },
                    {
                        "S": "https://www.pcadesign.com/wp-content/uploads/NU-Curry-Dining_5-1536x1114.jp"
                    }
                ]
            },
            "latitude": {
                "N": "42.338925"
            },
            "name": {
                "S": "Curry Student Center"
            },
            "email_address": {
                "S": "cie@northeastern.edu"
            }
        }
    }
}

const updateShelterDynamoDbInput_buildAttributeNamesList =
    ["name",
        "address.city",
        "address.country",
        "address.state",
        "address.street",
        "address.zipCode",
        "latitude",
        "longitude",
        "description",
        "rating",
        "phone_number",
        "email_address",
        "website",
        "picture"
    ]

const updateShelterDynamoDbInput_buildAttributeValuesList =
    [
        "Curry Student Center",
        "Boston",
        "United States",
        "MA",
        "360 Huntington Ave",
        "02115",
        42.338925,
        -71.088128,
        "The John A. and Marcia E. Curry Student Center is the crossroads for community life at Northeastern University, serving all members of the University",
        4.6,
        "617-373-2000",
        "cie@northeastern.edu",
        "https://calendar.northeastern.edu/curry_student_center",
        "[\"https://th.bing.com/th/id/OIP.OqpRP8dl-udJN9VAHIiCUQHaE8?rs=1&pid=ImgDetMain\",\"https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd609234077806.56c3572f1b380.jpg\",\"https://www.pcadesign.com/wp-content/uploads/NU-Curry-Dining_5-1536x1114.jpg\"]"
    ]

const updateShelterDynamoDbInput_HoursUpdateModel =
{
    "Monday": {
        "opening_time": "07:00",
        "closing_time": "24:00"
    },
    "Wednesday": {
        "opening_time": "07:00",
        "closing_time": "24:00"
    },
    "Thursday": {
        "opening_time": "07:00",
        "closing_time": "24:00"
    },
    "Friday": {
        "opening_time": "07:00",
        "closing_time": "23:00"
    },
    "Saturday": {
        "opening_time": "08:00",
        "closing_time": "23:00"
    },
    "Sunday": {
        "opening_time": "10:00",
        "closing_time": "24:00"
    },
    "Tuesday": null
}


describe('ShelterService', () => {
    let service: ShelterService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ShelterService,
                {
                    provide: DynamoDbService, // Mocking the dependency
                    useValue: mockDynamoDB
                },
            ],
        }).compile();

        service = module.get<ShelterService>(ShelterService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });


    describe('postShelter', () => {
        it('should successfully post a shelter', async () => {
            mockDynamoDB.getHighestShelterId.mockResolvedValue(1);
            mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

            const response = await service.postShelter(postReqSuccess);

            expect(mockDynamoDB.getHighestShelterId).toHaveBeenCalledWith('shelterlinkShelters');
            expect(mockDynamoDB.postItem).toHaveBeenCalledWith('shelterlinkShelters', postDynamoDBReqBodySuccess);
            expect(response).toStrictEqual(postReturnSuccess);
        });

        it('should correctly fail if dynamoDB returns an error for getHighestShelterId', async () => {
            mockDynamoDB.getHighestShelterId.mockRejectedValue(new Error('highest shelter id error'));
            await expect(service.postShelter(postReqSuccess)).rejects.toThrow('highest shelter id error');
            expect(mockDynamoDB.getHighestShelterId).toHaveBeenCalledWith('shelterlinkShelters');
        });

        it('should correctly fail if dynamoDB returns an error for postItem', async () => {
            mockDynamoDB.getHighestShelterId.mockResolvedValue(1);
            mockDynamoDB.postItem.mockRejectedValue(new Error('dynamodb post item error'));
            await expect(service.postShelter(postReqSuccess)).rejects.toThrow('dynamodb post item error');
            expect(mockDynamoDB.postItem).toHaveBeenCalledWith('shelterlinkShelters', postDynamoDBReqBodySuccess);
        });

        it('should reject an input with rating less than 0', async () => {
            mockDynamoDB.getHighestShelterId.mockResolvedValue(1);

            await expect(service.postShelter(postSubReqZeroFailure)).rejects.toThrow('Rating must be a number in the range (0, 5]');
        });

        it('should reject an input with rating of 0', async () => {
            mockDynamoDB.getHighestShelterId.mockResolvedValue(1);

            await expect(service.postShelter(postReqZeroFailure)).rejects.toThrow('Rating must be a number in the range (0, 5]');
        });

        it('should successfully post a shetler with rating of 5', async () => {
            mockDynamoDB.getHighestShelterId.mockResolvedValue(1);
            mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

            const response = await service.postShelter(postFiveRatingSuccess);

            expect(mockDynamoDB.getHighestShelterId).toHaveBeenCalledWith('shelterlinkShelters');
            expect(mockDynamoDB.postItem).toHaveBeenCalledWith('shelterlinkShelters', postDynamoDBReqBodyFiveRatingSuccess);
            expect(response).toStrictEqual(postReturnSuccess);
        });
    });

    describe('getShelters', () => {
        it('should successfully get shelters', async () => {
            mockDynamoDB.scanTable.mockResolvedValue(getSheltersReqSuccessDynamoDB);

            const response = await service.getShelters();
            expect(mockDynamoDB.scanTable).toHaveBeenCalledWith('shelterlinkShelters');
            expect(response).toStrictEqual(getSheltersReqSuccess);
        });

        it('should correctly fail if DynamoDB returns an error for scanTable', async () => {
            mockDynamoDB.scanTable.mockRejectedValue(new Error('dynamodb scanTable error'));
            await expect(service.getShelters()).rejects.toThrow('dynamodb scanTable error');
            expect(mockDynamoDB.scanTable).toHaveBeenCalledWith("shelterlinkShelters");
        });
    });

    describe('getShelter', () => {
        it('should successfully get a shelter', async () => {
            mockDynamoDB.scanTable.mockResolvedValue(getShelterReqSuccessDynamoDB);

            const response = await service.getShelter("6");
            expect(mockDynamoDB.scanTable).toHaveBeenCalledWith('shelterlinkShelters',
                'shelterId = :shelterId',
                { ':shelterId': { S: '6' } });
            expect(response).toStrictEqual(getShelterReqSuccess);
        });

        it('should correctly fail if DynamoDB returns an error for scanTable', async () => {
            mockDynamoDB.scanTable.mockRejectedValue(new Error('dynamodb scanTable error'));
            await expect(service.getShelter('6')).rejects.toThrow('Unable to get shelter: Error: dynamodb scanTable error');
            expect(mockDynamoDB.scanTable).toHaveBeenCalledWith('shelterlinkShelters',
                'shelterId = :shelterId',
                { ':shelterId': { S: '6' } });
        });
    });

    describe('deleteShelter', () => {
        it('should successfully delete a shelter', async () => {
            mockDynamoDB.deleteItem.mockResolvedValue(deleteDynamoDBSuccess);
            const response = await service.deleteShelter('13')
            expect(mockDynamoDB.deleteItem).toHaveBeenCalledWith('shelterlinkShelters', { shelterId: { S: '13' } });
            expect(response).toStrictEqual(undefined)
        });

        it('should correctly fail if dynamoDB deleteItem returns an error', async () => {
            mockDynamoDB.deleteItem.mockRejectedValue(new Error('dynamodb deleteItem error'));
            await expect(service.deleteShelter('13')).rejects.toThrow('Failed to delete shelter: dynamodb deleteItem error');
            expect(mockDynamoDB.deleteItem).toHaveBeenCalledWith('shelterlinkShelters', { shelterId: { S: '13' } });
        });
    });

    describe('updateShelter', () => {
        it('should correctly update an entire shelter', async () => {
            mockDynamoDB.updateAttributes.mockResolvedValue(updateShelterRequestSuccessDynamoDb);
            const response = await service.updateShelter('17', updateShelterRequestSuccess);
            expect(mockDynamoDB.updateAttributes).toHaveBeenCalledWith('shelterlinkShelters', '17', 
                updateShelterDynamoDbInput_buildAttributeNamesList, 
                updateShelterDynamoDbInput_buildAttributeValuesList,
                updateShelterDynamoDbInput_HoursUpdateModel);
        });

        /*it('should correctly fail if dynamoDB updateAttributes returns an error', async () => {
            mockDynamoDB.updateAttributes.mockRejectedValue(new Error('dynamodb updateAttributes error'));
            await expect(service.updateShelter('10', updateShelterRequestSuccess))
                .rejects.toThrow('Error: Unable to update new shelter: Error: dynamodb updateAttributes error');
        });*/
    });

});
