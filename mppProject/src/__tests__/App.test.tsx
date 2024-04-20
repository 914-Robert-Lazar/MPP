import { render} from '@testing-library/react'
import { expect, test } from 'vitest'
import App from '../App'
import AppRouter from '../router/router'


test("Renders the main page", () => {
    const rendering = render(<App/>)
    expect(rendering).toMatchSnapshot()
})

test("Rendering Add Exercise page", () => {
    const rendering2 = render(<AppRouter/>)
    expect(rendering2).toMatchSnapshot()
})
