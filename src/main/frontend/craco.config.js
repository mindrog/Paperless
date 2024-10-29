// craco.config.js
module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.module.rules.push({
                test: /\.svg$/,
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            throwIfNamespace: false, // 네임스페이스 오류 무시 설정
                        },
                    },
                ],
            });
            return webpackConfig;
        },
    },
};
