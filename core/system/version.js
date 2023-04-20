module.exports = {
    NAME: "KystFramework",
    BASE: "1.0p",
    DATE: "2023.04.04",
    RUNNER: [
        (process.versions.v8 ? "v8engine-" + process.versions.v8 : ""),
        (process.versions.uv ? "libuv-" + process.versions.uv : ""),
        process.version,
        process.arch, "alipoyrazaydin-kigipux"
    ].join(" ")
}
