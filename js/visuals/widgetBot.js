if(!device.mobile) {
    const script = Object.assign(document.createElement('script'), {
        src: 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3',
        async: true,
        onload: () => {
            const discEmbed = new Crate({ server: '1298477766290837554', channel: '1310975104460656662',
                location: ['bottom', 'right'], notifications: true, indicator: true, allChannelNotifications: true,
                defer: false, color: '#7289da'
            });
            plppdo.on('domChanged', () => window.location.href.includes("khanacademy.org/profile") ? discEmbed.show() : discEmbed.hide() );
        }
    });
    document.body.appendChild(script);
}
