import { Aurum } from 'aurumjs';
import * as stylesheet from '../../less/backend.less';
import * as aurumImg from '../../src/images/aurum.png';

export function SSR() {
    return (
        <html>
            <head>
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta
                    http-equiv="Content-Type"
                    content="text/html;charset=utf-8"
                />
                <meta name="viewport" content="width=auto,initial-scale=1" />
                <title>Aurum.js</title>
                <link rel="stylesheet" href={stylesheet} />
                <link rel="icon" href="./favicon.ico" />
            </head>
            <body>
                <div class="root">
                    <div class="hello">Hello Aurum</div>
                    <a href="https://aurumjs.org/" target="_blank">
                        <img src={aurumImg} class="aurum-img" />
                    </a>
                    <div class="links">
                        <a href="https://github.com/CyberPhoenix90/aurum">
                            Github
                        </a>
                        <a href="https://www.npmjs.com/package/aurumjs">Npm</a>
                        <a href="https://aurumjs.org/">Official website</a>
                        <a href="https://aurumjs.org/#/getting_started">
                            Getting Started
                        </a>
                    </div>
                    <div class="disclaimer">
                        <div>
                            Everything above me works with javascript disabled!
                        </div>
                        <div>But everything below me does not</div>
                    </div>
                    <div id="dynamic-content"></div>
                </div>
            </body>
            <script src="./static/js/app.bundle.js"></script>
        </html>
    );
}
