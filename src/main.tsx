import {
    ArrayDataSource,
    Aurum,
    CancellationToken,
    DataSource,
    DuplexDataSource,
} from 'aurumjs';
import '../less/frontend.less';

const users = DataSource.fromRemoteSource<number>(
    {
        host: location.host,
        id: 'users',
    },
    new CancellationToken()
);

const clicks = DuplexDataSource.fromRemoteSource<number>(
    {
        host: location.host,
        id: 'clicks',
    },
    new CancellationToken()
);

const persistentClicks = DataSource.fromRemoteSource<number>(
    {
        host: location.host,
        id: 'persistentClicks',
    },
    new CancellationToken()
);

const chat = ArrayDataSource.fromRemoteSource<string>(
    {
        host: location.host,
        id: 'chat',
    },
    new CancellationToken()
);

const msg = new DataSource('');

Aurum.attach(
    <div class="client">
        Real time application with SSR support and full DOM rendering library
        with under 20 KB of javascript!
        <div class="stats">
            Stats: (Try opening the page on multiple tabs)
            <div>Number of people on this page: {users}</div>
            <div>
                Number of clicks on this button since server start: {clicks}{' '}
                <button onClick={() => clicks.updateUpstream(clicks.value + 1)}>
                    Click me!
                </button>
            </div>
            <div>
                Number of clicks on that button since ever: {persistentClicks}{' '}
            </div>
        </div>
        <div>
            <ul
                class="chat"
                onAttach={(list) => {
                    chat.listen(() =>
                        list.scrollBy({
                            top: Number.MAX_SAFE_INTEGER,
                        })
                    );
                }}
            >
                {chat.map((line) => (
                    <li>{line}</li>
                ))}
            </ul>
            <label>
                Say hello!
                <input
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            sendMsg();
                        }
                    }}
                    value={msg}
                ></input>
                <button
                    onClick={() => {
                        sendMsg();
                    }}
                >
                    Send
                </button>
            </label>
        </div>
    </div>,
    document.getElementById('dynamic-content')
);
function sendMsg() {
    if (msg.value) {
        fetch('/chat', {
            method: 'POST',
            body: JSON.stringify({ message: msg.value }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        msg.update('');
    }
}
