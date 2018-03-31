import 'raf/polyfill'
import { configure } from 'enzyme'
import Adapter from './ReactSixteenAdapter'

configure({ adapter: new Adapter() })
