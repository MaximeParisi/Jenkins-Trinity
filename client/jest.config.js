module.exports = {
    transformIgnorePatterns: [
        "/node_modules/(?!axios)/"
    ],
    modulePaths: [],
    moduleNameMapper: {
        "^react-native$": "react-native-web",
        "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
        "^.+\\.(css|less|scss)$": "identity-obj-proxy",
        "bootstrap/dist/css/bootstrap.min.css": "identity-obj-proxy",
        "axios": "axios/dist/node/axios.cjs"
    },
    testEnvironment: "jsdom",
    testTimeout: 10000
};