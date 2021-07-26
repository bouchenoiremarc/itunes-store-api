import fetch from "isomorphic-unfetch"
import {
  Response,
  Lookup,
  PlainObject,
  Media,
  Options,
  Entities,
  SearchOptions,
  UrlMatch,
  Match,
  AlbumMatch,
  PodcastMatch,
  MatchOptions
} from "./types"
import { encodeURIFormComponent } from "./utils/encode-form-uri-component"
import { matchGroups } from "./utils/match-groups"

const API = "https://itunes.apple.com"

const regex =
  /^https?:\/\/(?<media>(?:apps|books|music|podcasts|))\.apple\.com\/(?<country>[a-z]+)\/(?<entity>[a-z-]+)/
const appRegex = /^https?:\/\/apps\.apple\.com\/[^/]*\/app\/[^/]*\/id(?<id>\d+)/
const artistRegex =
  /^https?:\/\/music\.apple\.com\/[^/]*\/artist\/[^/]*\/(?<id>\d+)/
const audiobookRegex =
  /^https?:\/\/books\.apple\.com\/[^/]*\/audiobook\/[^/]*\/id(?<id>\d+)/
const authorRegex =
  /^https?:\/\/books\.apple\.com\/[^/]*\/author\/[^/]*\/id(?<id>\d+)/
const bookRegex =
  /^https?:\/\/books\.apple\.com\/[^/]*\/book\/[^/]*\/id(?<id>\d+)/
const musicVideoRegex =
  /^https?:\/\/music\.apple\.com\/[^/]*\/music-video\/[^/]*\/(?<id>\d+)/
const podcastChannelRegex =
  /^https?:\/\/podcasts\.apple\.com\/[^/]*\/channel\/[^/]*\/id(?<id>\d+)/
const podcastRegex =
  /^https?:\/\/podcasts\.apple\.com\/[^/]*\/podcast\/[^/]*\/id(?<id>\d+)(?:\?.*i=(?<episodeId>\d+))?/
const albumRegex =
  /^https?:\/\/music\.apple\.com\/[^/]*\/album\/[^/]*\/(?<id>\d+)(?:\?.*i=(?<trackId>\d+))?/

const defaultOptions: Partial<Options<"all">> = {
  country: "us"
}

export class Client {
  private static async fetch<T = PlainObject>(
    endpoint: string,
    parameters: Record<string, boolean | number | string> = {}
  ): Promise<T> {
    const query = new URLSearchParams()

    for (const [parameter, value] of Object.entries(parameters)) {
      query.set(parameter, encodeURIFormComponent(value))
    }

    try {
      const response = await fetch(`${API}/${endpoint}?${query.toString()}`)

      if (response.ok) {
        return await response.json()
      } else {
        throw new Error(response.statusText)
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  private static match(url: string): Partial<MatchOptions> {
    const { country, entity, media } = matchGroups<Partial<UrlMatch>>(
      url,
      regex
    )

    if (!(country && entity && media)) {
      return {}
    }

    function getOptions(id?: string): Partial<MatchOptions> {
      return id ? { country, id: Number(id) } : {}
    }

    function getMatchedOptions(regex: RegExp): Partial<MatchOptions> {
      const { id } = matchGroups<Partial<Match>>(url, regex)

      return getOptions(id)
    }

    if (media === "apps") {
      return getMatchedOptions(appRegex)
    } else if (media === "books" && entity === "audiobook") {
      return getMatchedOptions(audiobookRegex)
    } else if (media === "books" && entity === "author") {
      return getMatchedOptions(authorRegex)
    } else if (media === "books" && entity === "book") {
      return getMatchedOptions(bookRegex)
    } else if (media === "music" && entity === "artist") {
      return getMatchedOptions(artistRegex)
    } else if (media === "music" && entity === "music-video") {
      return getMatchedOptions(musicVideoRegex)
    } else if (media === "podcasts" && entity === "channel") {
      return getMatchedOptions(podcastChannelRegex)
    } else if (media === "music" && entity === "album") {
      const { id, trackId } = matchGroups<Partial<AlbumMatch>>(url, albumRegex)

      return trackId ? getOptions(trackId) : getOptions(id)
    } else if (media === "podcasts" && entity === "podcast") {
      const { id, episodeId } = matchGroups<Partial<PodcastMatch>>(
        url,
        podcastRegex
      )

      return episodeId ? getOptions(episodeId) : getOptions(id)
    } else {
      return {}
    }
  }

  static async search<M extends Media, E extends Entities[M]>(
    search: string,
    options: Partial<SearchOptions<M, E>> = {}
  ): Promise<Response<M, E>> {
    const resolvedOptions = { ...defaultOptions, ...options }

    return await this.fetch<Response<M, E>>("search", {
      ...resolvedOptions,
      explicit: resolvedOptions.explicit ? "Yes" : "No",
      term: encodeURIFormComponent(search)
    })
  }

  static async lookup<M extends Media, E extends Entities[M]>(
    type: Lookup,
    value: number,
    options?: Partial<Options<M, E>>
  ): Promise<Response<M, E>>
  static async lookup<M extends Media, E extends Entities[M]>(
    type: "url",
    value: string,
    options?: Partial<Options<M, E>>
  ): Promise<Response<M, E>>
  static async lookup<M extends Media, E extends Entities[M]>(
    type: Lookup | "url",
    value: number | string,
    options: Partial<Options<M, E>> = {}
  ): Promise<Response<M, E>> {
    const resolvedOptions = { ...defaultOptions, ...options }
    const resolvedValue = (
      type === "url" ? this.match(String(value)) : { [type]: value }
    ) as Record<Exclude<Lookup, "url">, number | string>

    return await this.fetch<Response<M, E>>("lookup", {
      ...resolvedOptions,
      ...resolvedValue
    })
  }
}
