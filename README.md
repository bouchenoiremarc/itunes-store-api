# itunes-store-api

💿 Query Apple store catalogs using the iTunes Search API.

[![npm](https://img.shields.io/npm/v/itunes-store-api?color=%230cf)](https://www.npmjs.com/package/itunes-store-api) [![gzipped](https://img.shields.io/bundlephobia/minzip/itunes-store-api?label=gzipped&color=%2385f)](https://www.npmjs.com/package/itunes-store-api) [![license](https://img.shields.io/github/license/bouchenoiremarc/itunes-store-api?color=%2385f)](https://github.com/bouchenoiremarc/itunes-store-api/blob/main/LICENSE)

## Introduction

`itunes-store-api` is a typed [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/) client which adds support for [looking items up from their store URLs](#url).

## Installation

#### Skypack

```html
<script type="module">
  import { search, lookup } from "https://cdn.skypack.dev/itunes-store-api"
</script>
```

#### Yarn

```sh
yarn add itunes-store-api
```

#### npm

```sh
npm install itunes-store-api
```

## Usage

#### `search`

Import `search`.

```tsx
import { search } from "itunes-store-api"
```

Invoke it asynchronously and access results in return.

```tsx
const { results } = await search("M83")

// results: [Result, Result, Result...]
```

#### `lookup`

Import `lookup`.

```tsx
import { lookup } from "itunes-store-api"
```

Invoke it asynchronously using a lookup type (`"id"`, `"isbn"`, `"upc"`, `"url"`, `"amgAlbumId"`, `"amgArtistId"` or `"amgVideoId"`) and access a result in return.

```tsx
const { results } = await lookup("id", 1007596731)

// results: [Result]
```

##### `"url"`

A variety of store catalog URLs is supported when using the `"url"` lookup type.

| Entity          | Example                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| Software        | https://apps.apple.com/us/app/letterboxd/id1054271011                                                            |
| Audiobook       | https://books.apple.com/gb/audiobook/the-diary-of-a-young-girl/id1440416363                                      |
| Book            | https://books.apple.com/us/book/the-communist-manifesto/id395544966                                              |
| Author          | https://books.apple.com/us/author/albert-camus/id57528162                                                        |
| Song            | https://music.apple.com/us/album/kim-jessie/1007596648?i=1007596731                                              |
| Album           | https://music.apple.com/us/album/wolfgang-amadeus-phoenix/1450828963                                             |
| Music Video     | https://music.apple.com/us/music-video/daydreaming/1441607175                                                    |
| Artist          | https://music.apple.com/us/artist/a-g-cook/744253464                                                             |
| Podcast         | https://podcasts.apple.com/us/podcast/panic-podcast/id1495115716                                                 |
| Podcast Episode | https://podcasts.apple.com/us/podcast/168-auto-goats-feat-koen-bok-and-jorn-van-dijk/id947191070?i=1000376864263 |
| Podcast Channel | https://podcasts.apple.com/us/channel/france-culture/id6442484175                                                |

## Options

Both `search` and `lookup` support a trailing `options` argument.

#### `country`

A two-letter country code where the queried store catalog will be from. Defaults to `"us"`.

```tsx
await search("Le Fabuleux Destin d'Amélie Poulain", { country: "fr" })
```

#### `limit`

> Only available for `search`.

Limit the number of results. Defaults to `50`.

```tsx
await search("C418", { limit: 10 })
```

#### `sort`

> Only available for `search`.

Whether to sort results by popularity (`"popular"`) or recentness (`"recent"`). Defaults to `"popular"`.

```tsx
await search("Twitter", { sort: "popular" })
```

#### `media`

> Only available for `search`.

The media type to search for—see [Table 2-1](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/Searching.html). Defaults to `"all"`.

```tsx
await search("Lost in Translation", { media: "movie" })
```

#### `entity`

> Only available for `search`.

The type of results returned, relative to the specified media type—see [Table 2-1](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/Searching.html).

```tsx
await search("Things", { media: "software", entity: "macSoftware" })
```

#### `attribute`

> Only available for `search`.

Which attribute to search for, relative to the specified media type—see [Table 2-2](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/Searching.html).

```tsx
await search("Greta Gerwig", { entity: "movieArtist", attribute: "actorTerm" })
```

#### `explicit`

> Only available for `search`.

Whether or not to include explicit content. Defaults to `true`.

```tsx
await search("My Beautiful Dark Twisted Fantasy", { explicit: true })
```
