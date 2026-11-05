import { test, expect } from '@playwright/test'

test('deve poder cadastrar uma nova tarefa', async ({ page, request }) => {

    const taskName = 'Ler um livro de TypeScript'

    const response = await request.delete(
        `http://localhost:3333/helper/tasks/${encodeURIComponent(taskName)}`
    )

    console.log('Status DELETE:', response.status())

    expect(response.status()).toBe(204)

    await page.goto('http://localhost:8080')

    const inputTaskName = page.locator('input[class*=InputNewTask]')
    await inputTaskName.fill(taskName)

    await page.click('css=button >> text=Create')

    const target = page.locator(`.task-item p:text-is("${taskName}")`)
    await expect(target).toBeVisible()
})