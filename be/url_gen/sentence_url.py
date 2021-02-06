from random import choice, sample

vowels = {'a', 'e', 'i', 'o', 'u'}

with open("words/adjectives.txt") as adjs_file:
  adjectives = adjs_file.read().split()
with open("words/nouns.txt") as words_file:
  nouns = words_file.read().split()

class SentenceURL:

    def __init__(self, word_count = 3, capitalize = True, seperator = ''):
        self.word_count = word_count
        self.capitalize = capitalize
        self.seperator = seperator

    def generate(self):
        """Generates readable URLs like Twitch's clips"""

        if self.word_count < 2:
            raise ValueError('Minimum value expected: 2')
        elif self.word_count > 10:
            raise ValueError('Maximum value expected: 10')

        noun = choice(nouns)
        word_list = []

        word_list.extend(sample(adjectives, k = self.word_count-1))

        word_list.append(noun)

        if self.capitalize:
            word_list = map(str.title, word_list)

        return self.seperator.join(word_list)
