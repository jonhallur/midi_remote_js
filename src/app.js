import { Render, Router, Route, IndexRoute, Middleware } from 'jumpsuit'
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


Render(datasource, (
    <Router>
        <Route path="/" component={CLApp}>
            <IndexRoute component={Main} />
            <Route path="admin" component={Admin}>
                <Route path="manufacturers" component={Manufacturers} />
                <Route path="manufacturers/edit/:key" component={Manufacturer} />
                <Route path="sysexheaders" component={SysExHeaders} />
                <Route path="sysexheaders/edit/:key" component={SysExHeader} />
                <Route path="synthremotes" component={SynthRemotes} />
            </Route>
        </Route>
    </Router>
));