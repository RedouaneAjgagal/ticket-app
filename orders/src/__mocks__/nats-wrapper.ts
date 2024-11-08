const natsWrapper = {
    stan: {
        publish: jest.fn().mockImplementation()
    }
};

export default natsWrapper;