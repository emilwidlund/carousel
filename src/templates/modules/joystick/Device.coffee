class exports.Device
    constructor: (width, height) ->
        @deviceView = new Framer.DeviceView()
        @deviceView.setupContext()
        @deviceView.customize
            screenWidth: width
            screenHeight: height
        @deviceView.deviceScale = 1