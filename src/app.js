import { Render, Router, Route, IndexRoute } from 'jumpsuit'
/* state */
import datasource from 'state/index'
/* screens */
import CLApp from 'screens/index'
import Main from 'screens/main'
import Admin from 'screens/admin'
import Manufacturers from 'screens/manufacturers'
import Manufacturer from 'screens/manufacturer'
import SysExHeaders from 'screens/sysexheaders'
import SysExHeader from 'screens/sysexheader'
import SynthRemotes from 'screens/synthremotes'
import SynthRemote from 'screens/synthremote'
import SynthPanel from 'screens/synthpanel'


Render(datasource, (
    <Router>
        <Route path="/" component={CLApp}>
            <IndexRoute component={Main} />
            <Route path="admin" component={Admin}>
                <Route path="manufacturers" component={Manufacturers} />
                <Route path="manufacturer/edit/:key" component={Manufacturer} />
                <Route path="sysexheaders" component={SysExHeaders} />
                <Route path="sysexheader/edit/:key" component={SysExHeader} />
                <Route path="synthremotes" component={SynthRemotes} />
                <Route path="synthremote/edit/:key" component={SynthRemote} />
                <Route path="synthremote/:remote_id/panel/edit/:panel_id" component={SynthPanel} />
            </Route>
        </Route>
    </Router>
));