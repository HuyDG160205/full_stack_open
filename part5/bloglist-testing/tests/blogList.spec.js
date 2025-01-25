const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })
    // await request.post('http://localhost:3003/api/users', {
    //   data: {
    //     name: 'new User',
    //     username: 'newUser',
    //     password: 'newPassword',
    //   },
    // })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible(
      'Login form is not shown'
    )
    await expect(page.getByTestId('password')).toBeVisible()
    // await loginWith(page, 'mluukkai', 'salainen')
    // await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
      })
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
      })
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('1 likes')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      await createBlog(page, {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
      })
      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', async (dialog) => await dialog.accept())
      await page.getByRole('button', { name: 'Remove' }).click()
      await expect(page.getByText('React patterns')).not.toBeVisible()
    })

    test('blogs are ordered according to likes', async ({ page }) => {
      await createBlog(page, {
        title: 'Blog-1',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
      })
      await createBlog(page, {
        title: 'blog-2',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      })
      await createBlog(page, {
        title: 'blog-3',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      })

      const blog1 = await page.getByText('Blog-1').locator('..')
      const blog2 = await page.getByText('blog-2').locator('..')
      const blog3 = await page.getByText('blog-3').locator('..')

      await blog1.getByRole('button', { name: 'View' }).first().click()
      // await blog2.getByRole('button', { name: 'View' }).click()
      // await blog3.getByRole('button', { name: 'View' }).click()

      await blog1.getByRole('button', { name: 'like' }).click()
      // await blog2.getByRole('button', { name: 'like' }).click()
      // await blog3.getByRole('button', { name: 'like' }).click()
    })
  })

  test("user who added the blog sees the blog's delete button", async ({
    page,
    request,
  }) => {
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'new User',
        username: 'newUser',
        password: 'newPassword',
      },
    })
    await loginWith(page, 'newUser', 'newPassword')
    await createBlog(page, {
      title: 'from new user',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    })
    await page.getByRole('button', { name: 'logout' }).click()
    await loginWith(page, 'mluukkai', 'salainen')
    await page.getByRole('button', { name: 'view' }).click()
    await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible()
  })
})
