const daisy = {
    id: 1,
    name: 'Daisy',
    description: 'This is a dog, not a duck.',
    breed: 'Beagle',
    weight: 16,
    age: '8 months',
    size: 'M',
    pedigree: true,
    vaccinated: true,
    neutered: true,
    gender: 'F',
    isAvailable: true,
    price: 500
}

const donald = {
    id: 2,
    name: 'Donald',
    description: 'This is still a dog, not a duck.',
    breed: 'Beagle',
    weight: 22,
    age: '1 year',
    size: 'M',
    pedigree: false,
    vaccinated: false,
    neutered: false,
    gender: 'M',
    isAvailable: false,
    price: 500
}

const goofy = {
    id: 2,
    name: 'Goofy',
    description: "I'm pretty sure this is a dog",
    breed: 'Poodle',
    weight: 44,
    age: '16 months',
    size: 'L',
    pedigree: true,
    vaccinated: true,
    neutered: false,
    gender: 'M',
    isAvailable: false,
    price: 750
}

// expected response from get request for all puppies
const puppies = [
    daisy,
    donald,
    goofy
];


const johnOrders = [
    {
        id: 1,
        userId: 1,
        puppies: [donald, goofy],
        total: donald.price + goofy.price,
        orderDate: Date,
        status: 'string',
        orderDate: '2022-11-11 13:23:44'
    }
];

const john = {
    id: 1,
    shippingAddress: {
        street: '1234 Ditman Ave.',
        city: 'Sacramento',
        state: 'CA',
        zip: 12345
    },
    billingAddress: {
        street: '1234 Ditman Ave.',
        city: 'Sacramento',
        state: 'CA',
        zip: 12345
    },
    firstName: 'John',
    lastName: 'Doe',
    phone: 1235467890,
    email: 'j.doe@gmail.com',
    // paymentInfo: {
    //     token,
    //     stripeKey
    // },
    //need to set-up encryption for password
    // password: 'string',
    isAdminstrator: false,
    isActive: true,
    orders: johnOrders,
    cart: {
        puppies: [daisy],
        subtotal: daisy.price
    }
}

const jane = {
    id: 2,
    shippingAddress: {
        street: '4321 Mandit St.',
        city: 'New York',
        state: 'NY',
        zip: 54321
    },
    billingAddress: {
        street: '9876 New Mandit St.',
        city: 'Trenton',
        state: 'NJ',
        zip: 45678
    },
    firstName: 'Jane',
    lastName: 'Smith',
    phone: 0987654321,
    email: 'j.smith@gmail.com',
    // paymentInfo: {
    //     token,
    //     stripeKey
    // },
    //need to set-up encryption for password
    // password: 'string',
    isAdminstrator: true,
    isActive: true,
    orders: [],
    cart: {}
}

// expected response from get request for users
const users = [
    john,
    jane
];

module.exports = {
    daisy,
    donald,
    goofy,
    john,
    jane
}