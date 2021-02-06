from sentence_url import SentenceURL
generator = SentenceURL(3, True, '')

def pretty_url(url):
    neat_url = generator.generate()
    return((url, neat_url))

print(pretty_url('https://www.youtube.com/watch?v=iZsK96-mASY'))
