// Auto-generated — do not edit manually. Regenerate via scripts/gen-sample-data.ts
// IDs: ea2c9e35 | dcce34e9 | 7128ab39 | 9c7559e8

export interface SampleParseResult {
  label: string;
  url: string;
  thumb: string;
  type: string;
  filename: string;
  markdown: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result_json: any;
}

export const SAMPLE_PARSE_RESULTS: SampleParseResult[] = [
  {
    "label": "PDF Parser",
    "url": "https://cdn.xparse.ai/7-1_merged.pdf",
    "thumb": "https://cdn.xparse.ai/screenshot-20260412-212118.png",
    "type": "application/pdf",
    "filename": "7-1_merged.pdf",
    "markdown": "<!-- Speech and Language Processing. Daniel Jurafsky & James H. Martin. Copyright © 2026. Al1rights reserved. Draft of January 6, 2026. -->\n\n# CHAPTER\n\n# 7Large Language Models\n\n“How much do we know at any time? Much more, or so I believe, than we know we know.”\n\nAgatha Christie,The Moving Finger\n\nThe literature of the fantastic abounds in inanimate objects magically endowed with the gift of speech. From Ovid's statue of Pygmalion to Mary Shelley's story about\n\nFrankenstein, we continually reinvent stories about creating something and then having a chat with it. Legend has it that after finishing his sculpture Moses, Michelangelo thought it so lifelike that he tapped it on the knee and commanded it to speak. Perhaps this shouldn't be surprising. Language is the mark of humanity and sentience. conversation is the most fundamental arena of language, the first kind of lan-guage we learn as children, and the kind we engage in constantly, whether we are teaching or learning, or-dering lunch, or talking with our families or friends.\n\nThis chapter introduces the **Large** **Language**\n\n![](/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsLzJiNGFjYTk4NmE4NDcyNjcuanBn)\n\n**Model,** **or** **LLM,** a computational agent that can in-teract conversationally with people. The fact that LLMs are designed for interaction with people has strong implications for their design and use.\n\nMany of these implications already became clear in a computational systemfrom 60 years ago, ELIZA (Weizenbaum, 1966). ELIZA, designed to simulate a Rogerian psychologist,illustrates a number of important issues with chatbots. For example people became deeply emotionally involved and conducted very personal conversa-tions,even to the extent of asking Weizenbaum to leave the room while they were typing. These issues of emotional engagement and privacy mean we need to think carefully about how we deploy language models and consider their effect on the people who are interacting with them.\n\nIn this chapter we begin by introducing thecomputational principles of LLMs; we'll discuiss their implementation in the transformer architecture in the following chapter. The central new idea that makes LLMs possible is the idea of **pretraining,** so let's begin by thinking about the idea of learning from text,the basic way that LLMs are trained.\n\nWe know that fluent speakers of a language bring an enormous amount of knowl-edge to bear during comprehension and production. This knowledge is embodied in many forms, perhaps most obviously in the vocabulary, the rich representations we have of words and their meanings and usage. This makes the vocabulary a useful lens to explore the acquisition of knowledge from text, by both people and machines.\n\nEstimates of the size of adult vocabularies vary widlely both within and across languages. For example, estimates of the vocabulary size of young adult speakers of American English range from 30,000 to 100,000 depending on the resources used to make the estimate and the definition of what it means to know a word. A sim-ple consequence of these facts is that children have to learn about 7 to 10 words a day,every single day, to arrive at observed vocabulary levels by the time they are 20years of age. And indeed empirical estimates of vocabulary growth in late elemen-tary through high school are consistent with this rate. How do children achieve this rate of vocabulary growth? Research suggests that the bulk of this knowledge acqui-sition happens as a by-product of reading. Reading is a process of rich contextual processing; we don't learn words one at a time in isolation. In fact, at some points during learning the rate of vocabulary growth exceeds the rate at which new words are appearing to the learner! That suggests that every time we read a word, we are also strengthening our understanding of other words that are associated with it.\n\n<!-- **2** CHAPTER 7 ·LARGE LANGUAGE MODELS -->\n\nSuch facts are consistent with the distributional hypothesis of Chapter 5,which proposes that some aspects of meaning can be learned solely from the texts we en-counter over our lives, based on the complex association of words with the words they co-occur with (and with the words that those words occur with). The distribu-tional hypothesis suggests both that we can acquire remarkable amounts of knowl-edge from text, and that this knowledge can be brought to bear long after its initial acquisition. Of course, grounding from real-world interaction or other modalities can help build even more powerful models, but even text alone is remarkably useful.\n\n## pretraining\n\nWhat made the modern NLP revolution possible is that large language models can learn all this knowledge of language, context, and the world simply by being taught to predict the next word, again and again, based on context, in a (very) large corpus of text. In this chapter and the next we formalize this idea that we'll call pretraining-learning knowledge about language and the world from iteratively predicting tokens in vast amounts of text-and call the resulting pretrained models **large** **language** **models.** Large language models exhibit remarkable performance on natural language tasks because of the knowledge they learn in pretraining.\n\nWhat can language models learn from word prediction? Consider the examples below. What kinds of knowledge do you think the model might pick up from learn-ing to predict what word fills the underbar (the correct answer is shown in blue)? Think about this for each example before you read ahead to the next paragraph:.\n\nWith roses, dahlias, and peonies, I was surrounded byflowers\n\nThe room wasn't just big it wasenormous\n\nThe square root of 4 is2\n\n## The author of \"A Room of One's ODwn\"isVirginia Woolf\n\nThe professor said thathe\n\nFrom the first sentence a model can learn ontological facts like that roses and dahlias and peonies are all kinds of flowers. From the second, a model could learn that “enormous” means something on the same scale as big but further along on the scale. From the third sentence, the system could learn math, while from the 4th sentence facts about the world and historical authors. Finally,the last sentence, if a model was exposed to such sentences repeatedly, it might learn to associate professors only with mnale pronouns, or other kinds of associations that might cause models to act unfairly to different people.\n\n**What** **is** a **large** **language** **model?** As we saw back in Chapter 3, a language model is simply a computational system that can predict the next word from previous words. That is, given a context or prefix of words, a language model assigns a probability distribution over the possible next words. Fig. 7.1 sketches this idea.\n\nOf course we've already seen language models! We saw n-gram language mod-els in Chapter 3 and briefly touched on the feedforward network applied to language\n\n<!-- 3 -->\n\n<!-- p(w|context) output all .44 the .33 your .15 Transformer (or other decoder) that .08 input context So long and thanks for 2 -->\n![](/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsLzcwMzM1MTUxZGE5YzY0OWEuanBn)\n\n**Figure** 7.1 A large language modelis a neural network that takes as input a context or prefix, and outputs a distribution over possible next words.\n\nmodeling in Chapter 6. A large language model is just a (much) larger version of these. For example, in Chapter 3 we introduced bigram and trigram language mod-els that can predict words from the previous word or handful of words. By contrast, large language models can predict words given contexts of thousands or even tens of thousands of words!\n\nThe fundamental intuition of language models is that a model that can predict text (assigning a distribution over following words) can also be used to generate text by **sampling** from the distribution. Recall from Chapter 3 that sampling means to choose a word from a distribution.\n\n<!-- p(w|context) output .44 the .33 your .15 Transformer (or other decoder) that .08 So long and thanks for all p(w|context) output the .77 your .22 our .07 Transformer (or other decoder) of .02 So long and thanks for all the -->\n![](/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsLzY3YTEzYjNkZGE3ODk0MTEuanBn)\n\n**Figure** 7.2 Turning a predictive model that gives a probability distribution over next words into a generative model by repeatedly sampling from the distribution. The result is a left-to-right (also called autoregressive) language model. As each token is generated, it gets added onto the context as a prefix for generating the next token.\n\nFig. 7.2 shows the same example from Fig. 7.1, in which a language model is given a text prefix and generates a possible completion. The model selects the word all, adds that to the context, uses the updated context to get a new predictive distribution, and then selects the from that distribution and generates it, and so on. Notice that the model is conditioning on both the priming context and its own subsequently generated outputs.\n\nThis kind of setting in which we iteratively predict and generate words left-to-right from earlier words is often called **causal** or **autoregressive** language mod-els.(We will introduce alternative non-autoregressive models, like BERT and other masked language models that predict words using information from both the left and the right, in Chapter 9.)\n\n<!-- **4** CHAPTER 7 · LARGE LANGUAGE MODELS -->\n\n### generative AI\n\nThis idea of using computational models to generate text, as well as code,speech, and images, constitutes the important new area called **generative** **AI.** Applying LLMs to generate text has vastly broadened the scope of NLP, which historically was focused more on algorithms for parsing or understanding text rather than gen-eratingit.\n\nIn the rest of the chapter, we'll seethat almost any NLP task can be modeled as word prediction in a large language model, if we think about it in the right way, and we'll motivate and introduce the idea of **prompting** language models. We'll introduce specific algorithms for generating text from a language model, like **greedy** **decoding** and **sampling.** We'll introduce the details of **pretraining,the** way that language models are self-trained by iteratively being taught to guess the next word in the text from the prior words. We'll sketch out the other two stages of language model training: instruction tuning (also called supervised finetuning or SFT),and alignment, concepts that we'll return to in Chapter 10. And we'll see how to evaluate these models. Let's begin, though, by talking about different kinds of language models.\n\n### 7.1 Three architectures for language models\n\nThe architecture we sketched above for a left-to-right or autoregressive language model, which is the language model architecture we will define in this chapter, is actually only one of three common LM architectures.\n\nThe three architectures are the **encoder,** **the** **decoder,** and the **encoder-decoder.** Fig. 7.3 gives a schematic picture of the three.\n\n<table border=\"1\" ><tr>\n<td>WW W WW W W W<br>WW W W W W W W W W W W W<br>Decoder Encoder Encoder-Decoder<br><img src=\"/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsLzhjOWYxY2QyYjY2YTJiZTIuanBn\"><img src=\"/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsLzgwN2Q1ZjljYmEwMjkyYWEuanBn\"><img src=\"/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsL2U5ODlmYzAwMDcxZjA4ZDkuanBn\"></td>\n</tr></table>\n\n**Figure 7.3**Three architectures for language models: decoders, encoders, and encoder-decoders. The arrows sketch out the information flow in the three architectures. Decoders take tokens as input and generate tokens as output. Encoders take tokens as input and produce an encoding (a vector representation of each token) as output. Encoder-decoders take tokens as input and generate a series of tokens as output.\n\n**decoder**\n\nThe **decoder** is the architecture we've introduced above. It takes as input a series of tokens, and iteratively generates an output token one at a time. The decoder is the architecture used to create large language models like GPT, Claude,Llama,and Mistral. The information flow in decoders goes left-to-right, meaning that the model\n\n<!-- 7.3 · PROMPTING **7** -->\n\n<!-- prob Charles 2 token 2 token 2 Transformer (or other decoder) token 2 Q:Who wrote the book 'The Origin of Species' A: -->\n![](/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsLzY3YWU2OTUyZGM1NzhmNjYuanBn)\n\n**Figure** 7.5 Answering a question by computing the probabilities of the tokens after a prefix stating the question; in this example the correct token Charles has the highest probability.\n\nfollow instructions. This extra training is called **instruction-tuning.** In instruction-tuning we take a base language model that has been trained to predict words, and continue training it on a special dataset of instructions together with the appropriate response to each. The dataset has many examples of questions together with their answers, commands with their responses, and other examples of how to carry on a conversation. We'll discuss the details of instruction-tuning in Chapter 10.\n\n**prompt**\n\nLanguage models that have beeninstruction-tuned are very good at following instructions and answering questions and carrying on a conversation and can be **prompted.** **A** **prompt** is a text string that a user issues to a language model to get the model to do something useful. In prompting, the user's prompt string is passed to the language model, which iteratively generates tokens conditioned on the prompt. The process of finding effective prompts for a task is known as **prompt engineering.**\n\nAs suggested above when we introduced conditional generation, a prompt can be a question (like “What is a transformer network?\"), possibly in a struc-tured format (like “Q: What is a transformer network? A:\"). A prompt can also be an instruction (like “Translate the following sentence into Hindi: 'Chop the garlic finely'\").\n\nMore explicit prompts that specify the set of possible answers lead to better performance. For example, here is a prompt template to do sentiment analysis that prespecifies the potential answers:\n\n<table border=\"1\" ><tr>\n<td>A prompt consisting of a review plus an incomplete statement</td>\n</tr><tr>\n<td>Human: Do you think that “input” has negative or positive sentiment?<br>Choices:<br>(P) Positive<br>(N)Negative<br>Assistant: I believe the best answer is:(</td>\n</tr></table>\n\nThis prompt uses a number of more sophisticated prompting characteristics. It specifies the two allowable choices (P) and (N), and ends the prompt with the open parenthesis that strongly suggests the answer will be (P) or (N). Note that it also specifies the role of the language model as an assistant.\n\nIncluding some labeled examples in the prompt can also improve performance. We call such examples **demonstrations.** The task of prompting with examples is sometimes called **few-shot** **prompting,** as contrasted with **zero-shot** prompting which means instructions that don't include labeled examples. For example Fig. 7.6\n\n<!-- prompt -->\n\n<!-- engineering -->\n\n<!-- **demonstrations** -->\n\n<!-- **few-shot** -->\n\n<!-- zero-shot -->\n\n<!-- 7.5 · TRAINING LARGE LANGUAGE MODELS 17 -->\n\n**common crawl**\n\nWeb text is usualy taken from corpora of automatically-crawled web pages like **the** **common** **crawl,** a series of snapshots of the entire web produced by the non-profit Common Crawl (https://commoncrawl.org/) that each have billions of webpages. Various versions of common crawl data exist, suich as the Colossal Clean Crawled Corpus (C4; Raffel et al. 2020), a corpus of 156 billion tokens of English that is filtered in various ways (deduplicated, removing non-natural language like code,sentences with offensive words from a blocklist). This C4 corpus seems to consist in large part of patent text documents, Wikipedia, and news sites (Dodge et al.,2021).\n\nThe Pile\n\nWikipedia plays a role in lots of language model training, as do corpora of books. **The** **Pile** (Gao et al., 2020) is an 825 GB English text corpus that is constructed by publicly released code, containing again a large amount of text scraped from the web as well as books and Wikipedia; Fig. 7.14 shows its composition. Dolma is a larger open corpus of English, created with public tools, containing three trillion tokens, which similarly consists of web text, academic papers, code, books, encyclopedic materials, and social media (Soldaini et al., 2024).\n\n<!-- Bibliotik Pile-CC PG-19 BC2 PubMed Central ArXiv Subtitles StackExchange IRC EP PMA Github FreeLaw USPTO Phil NIH OpenWebText2 Wikipedia DM Math HN YT -->\n![](/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsL2I2ZWVlMDc1NzJlNDNmZjkuanBn)\n\n**Figure 7.14** The Pile corpus, showing the size of different components, color coded as academic (articles from PubMed and ArXiv, patents from the USPTA; internet (webtext in-cluding a subset of the common crawl as well as Wikipedia), prose (a large corpus of books), dialogue (including movie subtitles and chat data), and misc.. Figure from Gao et al. (2020).\n\n**Filtering** **for** **quality** **and** **safety** Pretraining data drawn from the web is filtered for both quality and safety. Quality filters are classifiers that assign a score to each document. Quality is of course subjective, so different quality filters are trained in different ways, but often to value high-quality reference corpora like Wikipedia, PII books,and particular websites and to avoid websites with lots ofPII (Personal Iden-tifiable Information) or adult content. Filters also remove boilerplate text which is very frequent on the web. Another kind of quality filtering is deduplication,which can be done at various levels, so as to remove duplicate documents, duplicate web pages, or duplicate text. Quality filtering generally improves language model per-formance (Longpre et al., 2024b; Llama Team, 2024).\n\nSafety filtering is again a subjective decision, and often includes **toxicity** detec-tion based on running off-the-shelf toxicity classifiers. This can have mixed results. One problem is that current toxicity classifiers mistakenly flag non-toxic data if it",
    "result_json": {
      "elements": [
        {
          "coordinates": [
            0.154412,
            0.049874,
            0.778595,
            0.049874,
            0.778595,
            0.071338,
            0.154412,
            0.071338
          ],
          "element_id": "56ce59fbb45cfb91fb8a363207cdb7bbe72953a1f1994161d295e645bdea6446",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false
          },
          "page_number": 1,
          "text": "Speech and Language Processing. Daniel Jurafsky & James H. Martin. Copyright © 2026. Al1rights reserved. Draft of January 6, 2026.",
          "type": "Header"
        },
        {
          "coordinates": [
            0.15768,
            0.149621,
            0.251634,
            0.149621,
            0.251634,
            0.160985,
            0.15768,
            0.160985
          ],
          "element_id": "5ef2b9c32cc857b677addde9964e1460aeae0fd934528fb938e30150f1185f75",
          "metadata": {
            "category_depth": 0,
            "children_ids": [],
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false
          },
          "page_number": 1,
          "text": "CHAPTER",
          "type": "Title"
        },
        {
          "coordinates": [
            0.159314,
            0.179924,
            0.696078,
            0.179924,
            0.696078,
            0.24053,
            0.156863,
            0.239268
          ],
          "element_id": "20a896fad50e56bf36b710a67312b636a505f7aca8aa78047b725a6a25e6651e",
          "metadata": {
            "category_depth": 0,
            "children_ids": [
              "86147e62cb188f92d121ef04672fe1a7687d5cbefb5a5d0acd51c251b3d3a986",
              "448e0af4141d37c593432bc4fe650a9d788495b7505c7d654e0756e671793882",
              "ab3eaad27f3982f6bf1b87bdac78189dc8588b7d65dbaa1474441f8970b0cd3e",
              "ceb07b71188d0f7f4effce0fd628e65db7bbfaec11a4f04c25e860b1586fcd29",
              "794d95fb580c646aae34b139271e6726ea75397d280e975e9538f98680956322",
              "660cb73694e5fb7dc70eecfd3b9c7b057b995a64adcc866f6ad164ee08127a7e",
              "e01b50dc9b72a34a9fb5d016c01e8b91511cb820f7469f008b9cb17a0e607058",
              "e6db9e3879a61fef660a179639f723f7ec1fc24af4c51ddca8e1b6146f43fd24",
              "bca473477c201f0238bb8c8cab199b4405fdc367ef70099ad6a1e04ec0b51264",
              "afb774e85e5ba01a7bd5d3f5d55a14ec21493fc6cf69a6ee40ae9392137f4309",
              "3e1a217b621731c3a10c2ad415265c7f4ac92e2c29d32cfccfcd4f1cd5d0f41d",
              "a64520d0acf79b0f4dad5743d5d2efa09ca9fba0ccbfe88d80befe1ae5612858",
              "2ccbec390d48958db12ca7d1297a2776ee9b72f359fbfe2d99b7fb28f7df8c94",
              "69cae40a584e33fdffb4d5df9d040e260af71ecc5f4917a3246f34fea16e6778",
              "68259870b12ff55a053942081f4600c52e7967cc8996911dce567e9f4bbb6213",
              "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0"
            ],
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false
          },
          "page_number": 1,
          "text": "7Large Language Models",
          "type": "Title"
        },
        {
          "coordinates": [
            0.299837,
            0.268939,
            0.80719,
            0.268939,
            0.80719,
            0.295455,
            0.299837,
            0.295455
          ],
          "element_id": "86147e62cb188f92d121ef04672fe1a7687d5cbefb5a5d0acd51c251b3d3a986",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "20a896fad50e56bf36b710a67312b636a505f7aca8aa78047b725a6a25e6651e"
          },
          "page_number": 1,
          "text": "“How much do we know at any time? Much more, or so I believe, than we know we know.”",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.566176,
            0.300505,
            0.808824,
            0.300505,
            0.808824,
            0.311869,
            0.566176,
            0.311869
          ],
          "element_id": "448e0af4141d37c593432bc4fe650a9d788495b7505c7d654e0756e671793882",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "20a896fad50e56bf36b710a67312b636a505f7aca8aa78047b725a6a25e6651e"
          },
          "page_number": 1,
          "text": "Agatha Christie,The Moving Finger",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.258987,
            0.337121,
            0.80719,
            0.337121,
            0.80719,
            0.364268,
            0.258987,
            0.364268
          ],
          "element_id": "ab3eaad27f3982f6bf1b87bdac78189dc8588b7d65dbaa1474441f8970b0cd3e",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "20a896fad50e56bf36b710a67312b636a505f7aca8aa78047b725a6a25e6651e"
          },
          "page_number": 1,
          "text": "The literature of the fantastic abounds in inanimate objects magically endowed with the gift of speech. From Ovid's statue of Pygmalion to Mary Shelley's story about",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.258987,
            0.367424,
            0.607026,
            0.367424,
            0.607026,
            0.527778,
            0.258987,
            0.527778
          ],
          "element_id": "ceb07b71188d0f7f4effce0fd628e65db7bbfaec11a4f04c25e860b1586fcd29",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "20a896fad50e56bf36b710a67312b636a505f7aca8aa78047b725a6a25e6651e"
          },
          "page_number": 1,
          "text": "Frankenstein, we continually reinvent stories about creating something and then having a chat with it. Legend has it that after finishing his sculpture Moses, Michelangelo thought it so lifelike that he tapped it on the knee and commanded it to speak. Perhaps this shouldn't be surprising. Language is the mark of humanity and sentience. conversation is the most fundamental arena of language, the first kind of lan-guage we learn as children, and the kind we engage in constantly, whether we are teaching or learning, or-dering lunch, or talking with our families or friends.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.283497,
            0.532828,
            0.607026,
            0.532828,
            0.607026,
            0.543561,
            0.283497,
            0.543561
          ],
          "element_id": "794d95fb580c646aae34b139271e6726ea75397d280e975e9538f98680956322",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "20a896fad50e56bf36b710a67312b636a505f7aca8aa78047b725a6a25e6651e"
          },
          "page_number": 1,
          "text": "This chapter introduces the **Large** **Language**",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.618464,
            0.369318,
            0.806373,
            0.368687,
            0.80719,
            0.558712,
            0.619281,
            0.559343
          ],
          "element_id": "660cb73694e5fb7dc70eecfd3b9c7b057b995a64adcc866f6ad164ee08127a7e",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "height": 300,
            "is_continuation": false,
            "parent_id": "20a896fad50e56bf36b710a67312b636a505f7aca8aa78047b725a6a25e6651e",
            "width": 230
          },
          "page_number": 1,
          "text": "",
          "type": "Image"
        },
        {
          "coordinates": [
            0.258987,
            0.54798,
            0.80719,
            0.54798,
            0.80719,
            0.588384,
            0.258987,
            0.588384
          ],
          "element_id": "e01b50dc9b72a34a9fb5d016c01e8b91511cb820f7469f008b9cb17a0e607058",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "20a896fad50e56bf36b710a67312b636a505f7aca8aa78047b725a6a25e6651e"
          },
          "page_number": 1,
          "text": "**Model,** **or** **LLM,** a computational agent that can in-teract conversationally with people. The fact that LLMs are designed for interaction with people has strong implications for their design and use.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.258987,
            0.592803,
            0.80719,
            0.592803,
            0.80719,
            0.710859,
            0.258987,
            0.710859
          ],
          "element_id": "e6db9e3879a61fef660a179639f723f7ec1fc24af4c51ddca8e1b6146f43fd24",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "20a896fad50e56bf36b710a67312b636a505f7aca8aa78047b725a6a25e6651e"
          },
          "page_number": 1,
          "text": "Many of these implications already became clear in a computational systemfrom 60 years ago, ELIZA (Weizenbaum, 1966). ELIZA, designed to simulate a Rogerian psychologist,illustrates a number of important issues with chatbots. For example people became deeply emotionally involved and conducted very personal conversa-tions,even to the extent of asking Weizenbaum to leave the room while they were typing. These issues of emotional engagement and privacy mean we need to think carefully about how we deploy language models and consider their effect on the people who are interacting with them.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.258987,
            0.713384,
            0.80719,
            0.713384,
            0.80719,
            0.784091,
            0.258987,
            0.784091
          ],
          "element_id": "bca473477c201f0238bb8c8cab199b4405fdc367ef70099ad6a1e04ec0b51264",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "20a896fad50e56bf36b710a67312b636a505f7aca8aa78047b725a6a25e6651e"
          },
          "page_number": 1,
          "text": "In this chapter we begin by introducing thecomputational principles of LLMs; we'll discuiss their implementation in the transformer architecture in the following chapter. The central new idea that makes LLMs possible is the idea of **pretraining,** so let's begin by thinking about the idea of learning from text,the basic way that LLMs are trained.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.258987,
            0.789141,
            0.80719,
            0.789141,
            0.80719,
            0.864268,
            0.258987,
            0.864268
          ],
          "element_id": "afb774e85e5ba01a7bd5d3f5d55a14ec21493fc6cf69a6ee40ae9392137f4309",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "20a896fad50e56bf36b710a67312b636a505f7aca8aa78047b725a6a25e6651e"
          },
          "page_number": 1,
          "text": "We know that fluent speakers of a language bring an enormous amount of knowl-edge to bear during comprehension and production. This knowledge is embodied in many forms, perhaps most obviously in the vocabulary, the rich representations we have of words and their meanings and usage. This makes the vocabulary a useful lens to explore the acquisition of knowledge from text, by both people and machines.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.258987,
            0.864899,
            0.80719,
            0.864899,
            0.80719,
            0.906566,
            0.258987,
            0.906566
          ],
          "element_id": "3e1a217b621731c3a10c2ad415265c7f4ac92e2c29d32cfccfcd4f1cd5d0f41d",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "20a896fad50e56bf36b710a67312b636a505f7aca8aa78047b725a6a25e6651e"
          },
          "page_number": 1,
          "text": "Estimates of the size of adult vocabularies vary widlely both within and across languages. For example, estimates of the vocabulary size of young adult speakers of American English range from 30,000 to 100,000 depending on the resources used to make the estimate and the definition of what it means to know a word. A sim-ple consequence of these facts is that children have to learn about 7 to 10 words a day,every single day, to arrive at observed vocabulary levels by the time they are 20years of age. And indeed empirical estimates of vocabulary growth in late elemen-tary through high school are consistent with this rate. How do children achieve this rate of vocabulary growth? Research suggests that the bulk of this knowledge acqui-sition happens as a by-product of reading. Reading is a process of rich contextual processing; we don't learn words one at a time in isolation. In fact, at some points during learning the rate of vocabulary growth exceeds the rate at which new words are appearing to the learner! That suggests that every time we read a word, we are also strengthening our understanding of other words that are associated with it.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.122549,
            0.104798,
            0.473039,
            0.104798,
            0.473039,
            0.114899,
            0.122549,
            0.114899
          ],
          "element_id": "a64520d0acf79b0f4dad5743d5d2efa09ca9fba0ccbfe88d80befe1ae5612858",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "20a896fad50e56bf36b710a67312b636a505f7aca8aa78047b725a6a25e6651e"
          },
          "page_number": 2,
          "text": "2 CHAPTER 7 ·LARGE LANGUAGE MODELS",
          "type": "Header"
        },
        {
          "coordinates": [
            0.228758,
            0.140783,
            0.778595,
            0.140783,
            0.778595,
            0.305556,
            0.228758,
            0.305556
          ],
          "element_id": "2ccbec390d48958db12ca7d1297a2776ee9b72f359fbfe2d99b7fb28f7df8c94",
          "metadata": {
            "category_depth": -1,
            "continuation_of": "3e1a217b621731c3a10c2ad415265c7f4ac92e2c29d32cfccfcd4f1cd5d0f41d",
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": true,
            "parent_id": "20a896fad50e56bf36b710a67312b636a505f7aca8aa78047b725a6a25e6651e"
          },
          "page_number": 2,
          "text": "to make the estimate and the definition of what it means to know a word. A sim-ple consequence of these facts is that children have to learn about 7 to 10 words a day,every single day, to arrive at observed vocabulary levels by the time they are 20years of age. And indeed empirical estimates of vocabulary growth in late elemen-tary through high school are consistent with this rate. How do children achieve this rate of vocabulary growth? Research suggests that the bulk of this knowledge acqui-sition happens as a by-product of reading. Reading is a process of rich contextual processing; we don't learn words one at a time in isolation. In fact, at some points during learning the rate of vocabulary growth exceeds the rate at which new words are appearing to the learner! That suggests that every time we read a word, we are also strengthening our understanding of other words that are associated with it.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.230392,
            0.306818,
            0.778595,
            0.306818,
            0.778595,
            0.426768,
            0.230392,
            0.426768
          ],
          "element_id": "69cae40a584e33fdffb4d5df9d040e260af71ecc5f4917a3246f34fea16e6778",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "20a896fad50e56bf36b710a67312b636a505f7aca8aa78047b725a6a25e6651e"
          },
          "page_number": 2,
          "text": "Such facts are consistent with the distributional hypothesis of Chapter 5,which proposes that some aspects of meaning can be learned solely from the texts we en-counter over our lives, based on the complex association of words with the words they co-occur with (and with the words that those words occur with). The distribu-tional hypothesis suggests both that we can acquire remarkable amounts of knowl-edge from text, and that this knowledge can be brought to bear long after its initial acquisition. Of course, grounding from real-world interaction or other modalities can help build even more powerful models, but even text alone is remarkably useful.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.14951,
            0.489899,
            0.210784,
            0.489899,
            0.210784,
            0.497475,
            0.14951,
            0.497475
          ],
          "element_id": "68259870b12ff55a053942081f4600c52e7967cc8996911dce567e9f4bbb6213",
          "metadata": {
            "category_depth": 1,
            "children_ids": [
              "115282b2564e300a64e2689b4219c85b9b0428d34003801c0cfcbdeb37aeec1f",
              "d74dbcd6fb2c8d80bf5dd2a6afdb083f923646860f7dc8ba976fee3c3ccf841c",
              "80f5e70a75ba3d761578efd8c74ffbdedfb7a6a79bcd58243c52fbbcb20b58ff",
              "4a5dbec67c7443b2455100422534915f53822838a2f570a1019f5b08d78de3e6",
              "4fdcc6867d5c8ffc433dd63ab24880ce91f2c29c1ef87ae9f8e04d2e3a0c476a"
            ],
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "20a896fad50e56bf36b710a67312b636a505f7aca8aa78047b725a6a25e6651e"
          },
          "page_number": 2,
          "text": "pretraining",
          "type": "Title"
        },
        {
          "coordinates": [
            0.230392,
            0.427399,
            0.778595,
            0.427399,
            0.778595,
            0.544192,
            0.230392,
            0.544192
          ],
          "element_id": "115282b2564e300a64e2689b4219c85b9b0428d34003801c0cfcbdeb37aeec1f",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "68259870b12ff55a053942081f4600c52e7967cc8996911dce567e9f4bbb6213"
          },
          "page_number": 2,
          "text": "What made the modern NLP revolution possible is that large language models can learn all this knowledge of language, context, and the world simply by being taught to predict the next word, again and again, based on context, in a (very) large corpus of text. In this chapter and the next we formalize this idea that we'll call pretraining-learning knowledge about language and the world from iteratively predicting tokens in vast amounts of text-and call the resulting pretrained models large language models. Large language models exhibit remarkable performance on natural language tasks because of the knowledge they learn in pretraining.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.230392,
            0.548611,
            0.778595,
            0.548611,
            0.778595,
            0.605429,
            0.230392,
            0.605429
          ],
          "element_id": "d74dbcd6fb2c8d80bf5dd2a6afdb083f923646860f7dc8ba976fee3c3ccf841c",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "68259870b12ff55a053942081f4600c52e7967cc8996911dce567e9f4bbb6213"
          },
          "page_number": 2,
          "text": "What can language models learn from word prediction? Consider the examples below. What kinds of knowledge do you think the model might pick up from learn-ing to predict what word fills the underbar (the correct answer is shown in blue)? Think about this for each example before you read ahead to the next paragraph:.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.258987,
            0.61553,
            0.715686,
            0.61553,
            0.715686,
            0.627525,
            0.258987,
            0.627525
          ],
          "element_id": "80f5e70a75ba3d761578efd8c74ffbdedfb7a6a79bcd58243c52fbbcb20b58ff",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "68259870b12ff55a053942081f4600c52e7967cc8996911dce567e9f4bbb6213"
          },
          "page_number": 2,
          "text": "With roses, dahlias, and peonies, I was surrounded byflowers",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.258987,
            0.631313,
            0.586601,
            0.631313,
            0.586601,
            0.642677,
            0.258987,
            0.642677
          ],
          "element_id": "4a5dbec67c7443b2455100422534915f53822838a2f570a1019f5b08d78de3e6",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "68259870b12ff55a053942081f4600c52e7967cc8996911dce567e9f4bbb6213"
          },
          "page_number": 2,
          "text": "The room wasn't just big it wasenormous",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.258987,
            0.647096,
            0.473856,
            0.645833,
            0.473039,
            0.655303,
            0.25817,
            0.656566
          ],
          "element_id": "4fdcc6867d5c8ffc433dd63ab24880ce91f2c29c1ef87ae9f8e04d2e3a0c476a",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "68259870b12ff55a053942081f4600c52e7967cc8996911dce567e9f4bbb6213"
          },
          "page_number": 2,
          "text": "The square root of 4 is2",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.258987,
            0.661616,
            0.687908,
            0.661616,
            0.687908,
            0.67298,
            0.258987,
            0.67298
          ],
          "element_id": "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0",
          "metadata": {
            "category_depth": 1,
            "children_ids": [
              "ae732c19f5452f183681afa9f07da42f6a4aea149cea91966c517f8c0a156cef",
              "b240bf264745901b7e82394091d2181c77db28d906d029c90857ba9a92ccde7a",
              "305fdfa8af3649085120e6c8ca3feae033218a9b17de82ccd1154833b3c131e5",
              "d407fb6128e55bfa991a916d1156f444a5a963861bbb8d464b1d0e9871e2594b",
              "c891ff2853355dc8ebec0fc40338c76d3781fd71795e4540dab00d626b21693a",
              "7f5480301ba08cd34a84cb1d4bfb07fef76de196f71a1aeb23ef8d99df27bb21",
              "be22996a9fcaa83d4aaf2e8918b0adedadb035a0b5e9666a2be8fb4062936805",
              "7d6d67c119f457fb0ff0922a57d51f0371394983d61e76059c72bb5d73a0ea43",
              "4db3902fb9d1dbe3321221402476b94b829dca4e1ed83697505da70c7c1fad9f",
              "1a722aec0a64372c3f5598eb4c8671dfcbd2db707940056a32dbf030a243a492",
              "73ffa5d57612d205a24f889620b103ed07909e3b3dbd6f478e4ed9e23df8b8f2",
              "3b0ac3ddf35fac23628652fb4e80e35e03a2e7a405ee1c7c6cdc32440648a391",
              "295b55b50be8392483c7124adcca9cf86d7376be4cfa3f817f8e7d502dbf924e",
              "c855d760fbfb501538b482e9567e0385e565fa6162fda38a5f26f459ffc348b3",
              "b5cbe21eb1caf767e576d38949396ab24dea241c10bbd5bb0ad981d60350ea29",
              "e3ca17b69f77d741c593a13448ba1c11b3d3f959b699797f96a76e6c3a9d4a60",
              "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
            ],
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "20a896fad50e56bf36b710a67312b636a505f7aca8aa78047b725a6a25e6651e"
          },
          "page_number": 2,
          "text": "The author of \"A Room of One's ODwn\"isVirginia Woolf",
          "type": "Title"
        },
        {
          "coordinates": [
            0.258987,
            0.676136,
            0.482843,
            0.676136,
            0.482843,
            0.6875,
            0.258987,
            0.6875
          ],
          "element_id": "ae732c19f5452f183681afa9f07da42f6a4aea149cea91966c517f8c0a156cef",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0"
          },
          "page_number": 2,
          "text": "The professor said thathe",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.229575,
            0.698864,
            0.778595,
            0.698864,
            0.778595,
            0.816919,
            0.229575,
            0.816919
          ],
          "element_id": "b240bf264745901b7e82394091d2181c77db28d906d029c90857ba9a92ccde7a",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0"
          },
          "page_number": 2,
          "text": "From the first sentence a model can learn ontological facts like that roses and dahlias and peonies are all kinds of flowers. From the second, a model could learn that “enormous” means something on the same scale as big but further along on the scale. From the third sentence, the system could learn math, while from the 4th sentence facts about the world and historical authors. Finally,the last sentence, if a model was exposed to such sentences repeatedly, it might learn to associate professors only with mnale pronouns, or other kinds of associations that might cause models to act unfairly to different people.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.230392,
            0.820076,
            0.778595,
            0.820076,
            0.778595,
            0.876894,
            0.230392,
            0.876894
          ],
          "element_id": "305fdfa8af3649085120e6c8ca3feae033218a9b17de82ccd1154833b3c131e5",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0"
          },
          "page_number": 2,
          "text": "What is a large language model? As we saw back in Chapter 3, a language model is simply a computational system that can predict the next word from previous words. That is, given a context or prefix of words, a language model assigns a probability distribution over the possible next words. Fig. 7.1 sketches this idea.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.230392,
            0.880051,
            0.778595,
            0.880051,
            0.778595,
            0.907197,
            0.230392,
            0.907197
          ],
          "element_id": "d407fb6128e55bfa991a916d1156f444a5a963861bbb8d464b1d0e9871e2594b",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0"
          },
          "page_number": 2,
          "text": "Of course we've already seen language models! We saw n-gram language mod-els in Chapter 3 and briefly touched on the feedforward network applied to language",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.794935,
            0.104798,
            0.80719,
            0.104798,
            0.80719,
            0.118056,
            0.794935,
            0.118056
          ],
          "element_id": "c891ff2853355dc8ebec0fc40338c76d3781fd71795e4540dab00d626b21693a",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0"
          },
          "page_number": 3,
          "text": "3",
          "type": "Header"
        },
        {
          "coordinates": [
            0.261438,
            0.136364,
            0.808007,
            0.135732,
            0.808824,
            0.295455,
            0.262255,
            0.296717
          ],
          "element_id": "7f5480301ba08cd34a84cb1d4bfb07fef76de196f71a1aeb23ef8d99df27bb21",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "height": 252,
            "is_continuation": false,
            "parent_id": "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0",
            "width": 669
          },
          "page_number": 3,
          "sub_type": "chart",
          "text": "p(w|context)outputall.44the.33your.15Transformer (or other decoder)that.08inputcontextSolongandthanksfor2",
          "type": "Image"
        },
        {
          "coordinates": [
            0.258987,
            0.294823,
            0.808824,
            0.294823,
            0.808824,
            0.321338,
            0.258987,
            0.321338
          ],
          "element_id": "be22996a9fcaa83d4aaf2e8918b0adedadb035a0b5e9666a2be8fb4062936805",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0"
          },
          "page_number": 3,
          "text": "Figure 7.1 A large language modelis a neural network that takes as input a context or prefix, and outputs a distribution over possible next words.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.258987,
            0.344066,
            0.808824,
            0.344066,
            0.808824,
            0.41351,
            0.258987,
            0.41351
          ],
          "element_id": "7d6d67c119f457fb0ff0922a57d51f0371394983d61e76059c72bb5d73a0ea43",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0"
          },
          "page_number": 3,
          "text": "modeling in Chapter 6. A large language model is just a (much) larger version of these. For example, in Chapter 3 we introduced bigram and trigram language mod-els that can predict words from the previous word or handful of words. By contrast, large language models can predict words given contexts of thousands or even tens of thousands of words!",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.25817,
            0.419192,
            0.80719,
            0.419192,
            0.80719,
            0.475379,
            0.25817,
            0.475379
          ],
          "element_id": "4db3902fb9d1dbe3321221402476b94b829dca4e1ed83697505da70c7c1fad9f",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0"
          },
          "page_number": 3,
          "text": "The fundamental intuition of language models is that a model that can predict text (assigning a distribution over following words) can also be used to generate text by sampling from the distribution. Recall from Chapter 3 that sampling means to choose a word from a distribution.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.269608,
            0.491793,
            0.805556,
            0.492424,
            0.806373,
            0.72601,
            0.269608,
            0.72601
          ],
          "element_id": "1a722aec0a64372c3f5598eb4c8671dfcbd2db707940056a32dbf030a243a492",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "height": 371,
            "is_continuation": false,
            "parent_id": "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0",
            "ref_element_id": "73ffa5d57612d205a24f889620b103ed07909e3b3dbd6f478e4ed9e23df8b8f2",
            "width": 656
          },
          "page_number": 3,
          "text": "p(w|context)output.44the.33your.15Transformer (or other decoder)that.08Solongandthanksforallp(w|context)outputthe.77your.22our.07Transformer (or other decoder)of.02Solongandthanksforallthe",
          "type": "Image"
        },
        {
          "coordinates": [
            0.258987,
            0.727273,
            0.808824,
            0.727273,
            0.808824,
            0.780934,
            0.258987,
            0.780934
          ],
          "element_id": "73ffa5d57612d205a24f889620b103ed07909e3b3dbd6f478e4ed9e23df8b8f2",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0"
          },
          "page_number": 3,
          "text": "Figure 7.2 Turning a predictive model that gives a probability distribution over next words into a generative model by repeatedly sampling from the distribution. The result is a left-to-right (also called autoregressive) language model. As each token is generated, it gets added onto the context as a prefix for generating the next token.",
          "type": "FigureCaption"
        },
        {
          "coordinates": [
            0.25817,
            0.804924,
            0.80719,
            0.804924,
            0.80719,
            0.892045,
            0.25817,
            0.892045
          ],
          "element_id": "3b0ac3ddf35fac23628652fb4e80e35e03a2e7a405ee1c7c6cdc32440648a391",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0"
          },
          "page_number": 3,
          "text": "Fig. 7.2 shows the same example from Fig. 7.1, in which a language model is given a text prefix and generates a possible completion. The model selects the word all, adds that to the context, uses the updated context to get a new predictive distribution, and then selects the from that distribution and generates it, and so on. Notice that the model is conditioning on both the priming context and its own subsequently generated outputs.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.283497,
            0.895202,
            0.80719,
            0.895202,
            0.80719,
            0.906566,
            0.283497,
            0.906566
          ],
          "element_id": "295b55b50be8392483c7124adcca9cf86d7376be4cfa3f817f8e7d502dbf924e",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0"
          },
          "page_number": 3,
          "text": "This kind of setting in which we iteratively predict and generate words left-to-",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.122549,
            0.104798,
            0.473039,
            0.104798,
            0.473039,
            0.114899,
            0.122549,
            0.114899
          ],
          "element_id": "c855d760fbfb501538b482e9567e0385e565fa6162fda38a5f26f459ffc348b3",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0"
          },
          "page_number": 4,
          "text": "4 CHAPTER 7 · LARGE LANGUAGE MODELS",
          "type": "Header"
        },
        {
          "coordinates": [
            0.228758,
            0.140783,
            0.778595,
            0.140783,
            0.778595,
            0.198232,
            0.228758,
            0.198232
          ],
          "element_id": "b5cbe21eb1caf767e576d38949396ab24dea241c10bbd5bb0ad981d60350ea29",
          "metadata": {
            "category_depth": -1,
            "continuation_of": "295b55b50be8392483c7124adcca9cf86d7376be4cfa3f817f8e7d502dbf924e",
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": true,
            "parent_id": "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0"
          },
          "page_number": 4,
          "text": "right from earlier words is often called causal or autoregressive language mod-els.(We will introduce alternative non-autoregressive models, like BERT and other masked language models that predict words using information from both the left and the right, in Chapter 9.)",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.137255,
            0.217803,
            0.210784,
            0.21654,
            0.209967,
            0.224747,
            0.137255,
            0.22601
          ],
          "element_id": "e3ca17b69f77d741c593a13448ba1c11b3d3f959b699797f96a76e6c3a9d4a60",
          "metadata": {
            "category_depth": 2,
            "children_ids": [
              "55f0e119f660f342bca1e4de9c72ab6d913f072d7a10aa0d921f1a081c847b2b",
              "ea62929108e89f3ddb6e22dff4ff9b3db67b1f52fa8ec821b04a92b1924729cc"
            ],
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0"
          },
          "page_number": 4,
          "text": "generative AI",
          "type": "Title"
        },
        {
          "coordinates": [
            0.230392,
            0.201389,
            0.778595,
            0.201389,
            0.778595,
            0.275253,
            0.230392,
            0.275253
          ],
          "element_id": "55f0e119f660f342bca1e4de9c72ab6d913f072d7a10aa0d921f1a081c847b2b",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "e3ca17b69f77d741c593a13448ba1c11b3d3f959b699797f96a76e6c3a9d4a60"
          },
          "page_number": 4,
          "text": "This idea of using computational models to generate text, as well as code,speech, and images, constitutes the important new area called generative AI. Applying LLMs to generate text has vastly broadened the scope of NLP, which historically was focused more on algorithms for parsing or understanding text rather than gen-eratingit.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.227941,
            0.276515,
            0.778595,
            0.276515,
            0.778595,
            0.4375,
            0.227941,
            0.4375
          ],
          "element_id": "ea62929108e89f3ddb6e22dff4ff9b3db67b1f52fa8ec821b04a92b1924729cc",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "e3ca17b69f77d741c593a13448ba1c11b3d3f959b699797f96a76e6c3a9d4a60"
          },
          "page_number": 4,
          "text": "In the rest of the chapter, we'll seethat almost any NLP task can be modeled as word prediction in a large language model, if we think about it in the right way, and we'll motivate and introduce the idea of prompting language models. We'll introduce specific algorithms for generating text from a language model, like greedy decoding and sampling. We'll introduce the details of pretraining,the way that language models are self-trained by iteratively being taught to guess the next word in the text from the prior words. We'll sketch out the other two stages of language model training: instruction tuning (also called supervised finetuning or SFT),and alignment, concepts that we'll return to in Chapter 10. And we'll see how to evaluate these models. Let's begin, though, by talking about different kinds of language models.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.121732,
            0.467172,
            0.643791,
            0.468434,
            0.644608,
            0.488005,
            0.122549,
            0.486742
          ],
          "element_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299",
          "metadata": {
            "category_depth": 2,
            "children_ids": [
              "19dbedd4fad93bfdf35ab30298413a822fc4ad84ea7b949fda517ec814464dec",
              "fde1436cbff4ef683b96c987f7b6b437d97e8b28003f989da015faa6bf1873d1",
              "8cb41d2eae46a8e25f221debb3557a39f424edf4eea00d58ec4ed12e599236fc",
              "a2bb214341341b64efc527075f5d9d32828ebbfd0c55a94233addb975634d7bc",
              "6cad50941480e366a505d5927c7d62c09b80c0cf6b31988764182b83054da2fb",
              "518df90592b2ddacb8743f65fd42a29edd7df2bbc5a9b6f570baaf04c7cc5872",
              "f091086f6bc9b0520f997700f6904dc2839a84eeb690a5c2da554271a104d6d3",
              "b755d636ae536a738afc439be3b4ad08632acaf758d313c3a6b6cd27142c7c19",
              "b215d3f88a8c79c1a5f91afb2cc539ba652ed74c2f8bf4fb512b3b0deb4cca5f",
              "dcf00fc9007674f20d3860b89ea91d757d0887c9847baf814c2b661b0179282d",
              "513437c6a650f3c9f73cd46056891c34de7fd60676afab934991f5eb29a3826f",
              "ab1180adbaad13dcf4324c5d9602e8560f7f53f759b956e1fb17805c6fbe2653",
              "cba2c0c5c4ab97818b123acd1a4ce7b73709103d61cd67db920d888ef8ac3599",
              "7d043e3feee4ccbc866245e5cf99619e1af144f36f456be39ee399e0c20b5bd8",
              "9ff3c5ada1db1c45afde498ac6dcb4f5a9ddfdf1df169f8c200706847547efbf",
              "0f54d8abfcf937260b4b0fe14606c54d0062afdd1cc89f0875dc450259c2881c",
              "b66b05dc90827ee423d96593df41bad7562b19474896c3e2ca81f74413a9a2c8",
              "204c045ee83d9789ed0868b1d5b34c3c27874143fdcee67fc433c4cefe93648e",
              "593d00c0e7004853f3d1f27c567c1482d6bf994b2e40bddd391f36b9e8ca3884",
              "4c1b72f3a991681610bb921e0082ee7ff6d3cd132178c96e75315c53bd3b94d4",
              "21481351a424462a9255064c578ec5a523a7393a6f5294d62de2bc901235d62c",
              "ae5cbea432e94b324cde171203a768f34bb808512969b02ae0d9912e43f99287",
              "87a304d02d06e40f3f33c63244cdaacd0ce80da4c40b126f7ea37edda5bec126",
              "dc185774621fce1cd2524d58c30a5318491b4638e0d2c78cdbb459744f8a859c",
              "5048f42668b7401c5c286873503b52caf06fcffbba86b5dcd2a47b19045c76bd",
              "e6d7d51983df9d4b59f421f860b1fab5deaf0203dce61b7c47ce61faeb34a3a8"
            ],
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "ae6171bd551dfd5b072d8858e614b15817d6083c97549c241e34bd3bedea47d0"
          },
          "page_number": 4,
          "text": "7.1 Three architectures for language models",
          "type": "Title"
        },
        {
          "coordinates": [
            0.230392,
            0.517677,
            0.778595,
            0.517677,
            0.778595,
            0.559975,
            0.230392,
            0.559975
          ],
          "element_id": "19dbedd4fad93bfdf35ab30298413a822fc4ad84ea7b949fda517ec814464dec",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 4,
          "text": "The architecture we sketched above for a left-to-right or autoregressive language model, which is the language model architecture we will define in this chapter, is actually only one of three common LM architectures.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.230392,
            0.563131,
            0.778595,
            0.563131,
            0.778595,
            0.589646,
            0.230392,
            0.589646
          ],
          "element_id": "fde1436cbff4ef683b96c987f7b6b437d97e8b28003f989da015faa6bf1873d1",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 4,
          "text": "The three architectures are the encoder, the decoder, and the encoder-decoder. Fig. 7.3 gives a schematic picture of the three.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.129085,
            0.605429,
            0.772876,
            0.604798,
            0.772876,
            0.775253,
            0.129085,
            0.776515
          ],
          "element_id": "8cb41d2eae46a8e25f221debb3557a39f424edf4eea00d58ec4ed12e599236fc",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 4,
          "sub_type": "borderless",
          "text": "<table border=\"1\" ><tr>\n<td>WWWWWWWWWWWWWWWWWWWWWDecoderEncoderEncoder-Decoder</td>\n</tr></table>",
          "type": "Table"
        },
        {
          "coordinates": [
            0.124183,
            0.778409,
            0.778595,
            0.778409,
            0.778595,
            0.832071,
            0.124183,
            0.832071
          ],
          "element_id": "a2bb214341341b64efc527075f5d9d32828ebbfd0c55a94233addb975634d7bc",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 4,
          "text": "Figure 7.3Three architectures for language models: decoders, encoders, and encoder-decoders. The arrows sketch out the information flow in the three architectures. Decoders take tokens as input and generate tokens as output. Encoders take tokens as input and produce an encoding (a vector representation of each token) as output. Encoder-decoders take tokens as input and generate a series of tokens as output.",
          "type": "FigureCaption"
        },
        {
          "coordinates": [
            0.16585,
            0.852273,
            0.210784,
            0.852273,
            0.210784,
            0.859848,
            0.16585,
            0.859848
          ],
          "element_id": "6cad50941480e366a505d5927c7d62c09b80c0cf6b31988764182b83054da2fb",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 4,
          "text": "decoder",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.229575,
            0.850379,
            0.778595,
            0.850379,
            0.778595,
            0.909091,
            0.229575,
            0.909091
          ],
          "element_id": "518df90592b2ddacb8743f65fd42a29edd7df2bbc5a9b6f570baaf04c7cc5872",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 4,
          "text": "The decoder is the architecture we've introduced above. It takes as input a series of tokens, and iteratively generates an output token one at a time. The decoder is the architecture used to create large language models like GPT, Claude,Llama,and Mistral. The information flow in decoders goes left-to-right, meaning that the model",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.630719,
            0.105429,
            0.80719,
            0.105429,
            0.80719,
            0.118056,
            0.630719,
            0.118056
          ],
          "element_id": "f091086f6bc9b0520f997700f6904dc2839a84eeb690a5c2da554271a104d6d3",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 5,
          "text": "7.3 · PROMPTING  7",
          "type": "Header"
        },
        {
          "coordinates": [
            0.267974,
            0.137626,
            0.805556,
            0.136995,
            0.806373,
            0.299874,
            0.267974,
            0.300505
          ],
          "element_id": "b755d636ae536a738afc439be3b4ad08632acaf758d313c3a6b6cd27142c7c19",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "height": 257,
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299",
            "width": 658
          },
          "page_number": 5,
          "text": "probCharles2token2token2Transformer (or other decoder)token2Q:Who wrote the book 'The Origin of Species' A:",
          "type": "Image"
        },
        {
          "coordinates": [
            0.258987,
            0.296717,
            0.80719,
            0.296717,
            0.80719,
            0.323232,
            0.258987,
            0.323232
          ],
          "element_id": "b215d3f88a8c79c1a5f91afb2cc539ba652ed74c2f8bf4fb512b3b0deb4cca5f",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 5,
          "text": "Figure 7.5 Answering a question by computing the probabilities of the tokens after a prefix stating the question; in this example the correct token Charles has the highest probability.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.258987,
            0.342172,
            0.80719,
            0.342172,
            0.80719,
            0.42803,
            0.258987,
            0.42803
          ],
          "element_id": "dcf00fc9007674f20d3860b89ea91d757d0887c9847baf814c2b661b0179282d",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 5,
          "text": "follow instructions. This extra training is called instruction-tuning. In instruction-tuning we take a base language model that has been trained to predict words, and continue training it on a special dataset of instructions together with the appropriate response to each. The dataset has many examples of questions together with their answers, commands with their responses, and other examples of how to carry on a conversation. We'll discuss the details of instruction-tuning in Chapter 10.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.196895,
            0.464646,
            0.240196,
            0.464646,
            0.240196,
            0.472854,
            0.196895,
            0.472854
          ],
          "element_id": "513437c6a650f3c9f73cd46056891c34de7fd60676afab934991f5eb29a3826f",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 5,
          "text": "prompt",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.258987,
            0.431818,
            0.80719,
            0.431818,
            0.80719,
            0.519571,
            0.258987,
            0.519571
          ],
          "element_id": "ab1180adbaad13dcf4324c5d9602e8560f7f53f759b956e1fb17805c6fbe2653",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 5,
          "text": "Language models that have beeninstruction-tuned are very good at following instructions and answering questions and carrying on a conversation and can be prompted. A prompt is a text string that a user issues to a language model to get the model to do something useful. In prompting, the user's prompt string is passed to the language model, which iteratively generates tokens conditioned on the prompt. The process of finding effective prompts for a task is known as prompt engineering.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.25817,
            0.522727,
            0.80719,
            0.522727,
            0.80719,
            0.596591,
            0.25817,
            0.596591
          ],
          "element_id": "cba2c0c5c4ab97818b123acd1a4ce7b73709103d61cd67db920d888ef8ac3599",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 5,
          "text": "As suggested above when we introduced conditional generation, a prompt can be a question (like “What is a transformer network?\"), possibly in a struc-tured format (like “Q: What is a transformer network? A:\"). A prompt can also be an instruction (like “Translate the following sentence into Hindi: 'Chop the garlic finely'\").",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.258987,
            0.598485,
            0.80719,
            0.598485,
            0.80719,
            0.640152,
            0.258987,
            0.640152
          ],
          "element_id": "7d043e3feee4ccbc866245e5cf99619e1af144f36f456be39ee399e0c20b5bd8",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 5,
          "text": "More explicit prompts that specify the set of possible answers lead to better performance. For example, here is a prompt template to do sentiment analysis that prespecifies the potential answers:",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.26634,
            0.647096,
            0.804739,
            0.647727,
            0.804739,
            0.777146,
            0.265523,
            0.777146
          ],
          "element_id": "9ff3c5ada1db1c45afde498ac6dcb4f5a9ddfdf1df169f8c200706847547efbf",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 5,
          "sub_type": "bordered",
          "text": "<table border=\"1\" ><tr>\n<td>A prompt consisting of a review plus an incomplete statement</td>\n</tr><tr>\n<td>Human: Do you think that “input” has negative or positive sentiment?Choices:(P) Positive(N)NegativeAssistant: I believe the best answer is:(</td>\n</tr></table>",
          "type": "Table"
        },
        {
          "coordinates": [
            0.258987,
            0.789773,
            0.808824,
            0.789773,
            0.808824,
            0.847222,
            0.258987,
            0.847222
          ],
          "element_id": "0f54d8abfcf937260b4b0fe14606c54d0062afdd1cc89f0875dc450259c2881c",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 5,
          "text": "This prompt uses a number of more sophisticated prompting characteristics. It specifies the two allowable choices (P) and (N), and ends the prompt with the open parenthesis that strongly suggests the answer will be (P) or (N). Note that it also specifies the role of the language model as an assistant.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.258987,
            0.849747,
            0.808824,
            0.849747,
            0.808824,
            0.906566,
            0.258987,
            0.906566
          ],
          "element_id": "b66b05dc90827ee423d96593df41bad7562b19474896c3e2ca81f74413a9a2c8",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 5,
          "text": "Including some labeled examples in the prompt can also improve performance. We call such examples demonstrations. The task of prompting with examples is sometimes called few-shot prompting, as contrasted with zero-shot prompting which means instructions that don't include labeled examples. For example Fig. 7.6",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.433824,
            0.106061,
            0.808824,
            0.106061,
            0.808824,
            0.116793,
            0.433824,
            0.116793
          ],
          "element_id": "204c045ee83d9789ed0868b1d5b34c3c27874143fdcee67fc433c4cefe93648e",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 6,
          "text": "7.5 · TRAINING LARGE LANGUAGE MODELS 17",
          "type": "Header"
        },
        {
          "coordinates": [
            0.160131,
            0.157828,
            0.240196,
            0.157828,
            0.240196,
            0.165404,
            0.160131,
            0.165404
          ],
          "element_id": "593d00c0e7004853f3d1f27c567c1482d6bf994b2e40bddd391f36b9e8ca3884",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 6,
          "text": "common crawl",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.258987,
            0.140783,
            0.808824,
            0.140783,
            0.808824,
            0.272727,
            0.258987,
            0.272727
          ],
          "element_id": "4c1b72f3a991681610bb921e0082ee7ff6d3cd132178c96e75315c53bd3b94d4",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 6,
          "text": "Web text is usualy taken from corpora of automatically-crawled web pages like the common crawl, a series of snapshots of the entire web produced by the non-profit Common Crawl (https://commoncrawl.org/) that each have billions of webpages. Various versions of common crawl data exist, suich as the Colossal Clean Crawled Corpus (C4; Raffel et al. 2020), a corpus of 156 billion tokens of English that is filtered in various ways (deduplicated, removing non-natural language like code,sentences with offensive words from a blocklist). This C4 corpus seems to consist in large part of patent text documents, Wikipedia, and news sites (Dodge et al.,2021).",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.194444,
            0.293561,
            0.240196,
            0.293561,
            0.240196,
            0.301136,
            0.194444,
            0.301136
          ],
          "element_id": "21481351a424462a9255064c578ec5a523a7393a6f5294d62de2bc901235d62c",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 6,
          "text": "The Pile",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.258987,
            0.276515,
            0.80719,
            0.276515,
            0.80719,
            0.378157,
            0.258987,
            0.378157
          ],
          "element_id": "ae5cbea432e94b324cde171203a768f34bb808512969b02ae0d9912e43f99287",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 6,
          "text": "Wikipedia plays a role in lots of language model training, as do corpora of books. The Pile (Gao et al., 2020) is an 825 GB English text corpus that is constructed by publicly released code, containing again a large amount of text scraped from the web as well as books and Wikipedia; Fig. 7.14 shows its composition. Dolma is a larger open corpus of English, created with public tools, containing three trillion tokens, which similarly consists of web text, academic papers, code, books, encyclopedic materials, and social media (Soldaini et al., 2024).",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.26634,
            0.39899,
            0.803105,
            0.39899,
            0.803922,
            0.626263,
            0.267157,
            0.625631
          ],
          "element_id": "87a304d02d06e40f3f33c63244cdaacd0ce80da4c40b126f7ea37edda5bec126",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "height": 360,
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299",
            "width": 657
          },
          "page_number": 6,
          "text": "BibliotikPile-CCPG-19BC2PubMed CentralArXivSubtitlesStackExchangeIRCEPPMAGithubFreeLawUSPTOPhilNIHOpenWebText2WikipediaDM MathHNYT",
          "type": "Image"
        },
        {
          "coordinates": [
            0.258987,
            0.630051,
            0.808824,
            0.630051,
            0.808824,
            0.685606,
            0.258987,
            0.685606
          ],
          "element_id": "dc185774621fce1cd2524d58c30a5318491b4638e0d2c78cdbb459744f8a859c",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 6,
          "text": "Figure 7.14 The Pile corpus, showing the size of different components, color coded as academic (articles from PubMed and ArXiv, patents from the USPTA; internet (webtext in-cluding a subset of the common crawl as well as Wikipedia), prose (a large corpus of books), dialogue (including movie subtitles and chat data), and misc.. Figure from Gao et al. (2020).",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.218954,
            0.714015,
            0.80719,
            0.714015,
            0.80719,
            0.861111,
            0.218954,
            0.861111
          ],
          "element_id": "5048f42668b7401c5c286873503b52caf06fcffbba86b5dcd2a47b19045c76bd",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 6,
          "text": "Filtering for quality and safety Pretraining data drawn from the web is filtered for both quality and safety. Quality filters are classifiers that assign a score to each document. Quality is of course subjective, so different quality filters are trained in different ways, but often to value high-quality reference corpora like Wikipedia, PII   books,and particular websites and to avoid websites with lots ofPII (Personal Iden-tifiable Information) or adult content. Filters also remove boilerplate text which is very frequent on the web. Another kind of quality filtering is deduplication,which can be done at various levels, so as to remove duplicate documents, duplicate web pages, or duplicate text. Quality filtering generally improves language model per-formance (Longpre et al., 2024b; Llama Team, 2024).",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.258987,
            0.864899,
            0.80719,
            0.864899,
            0.80719,
            0.907197,
            0.258987,
            0.907197
          ],
          "element_id": "e6d7d51983df9d4b59f421f860b1fab5deaf0203dce61b7c47ce61faeb34a3a8",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/7-1_merged.pdf"
              },
              "url": "file://temp/7-1_merged.pdf"
            },
            "is_continuation": false,
            "parent_id": "087b0ba63c1312e8b5dd9149d610f4cdbfc0d48010f28b7981c3d6a820eae299"
          },
          "page_number": 6,
          "text": "Safety filtering is again a subjective decision, and often includes toxicity detec-tion based on running off-the-shelf toxicity classifiers. This can have mixed results. One problem is that current toxicity classifiers mistakenly flag non-toxic data if it",
          "type": "NarrativeText"
        }
      ],
      "markdown": "<!-- Speech and Language Processing. Daniel Jurafsky & James H. Martin. Copyright © 2026. Al1rights reserved. Draft of January 6, 2026. -->\n\n# CHAPTER\n\n# 7Large Language Models\n\n“How much do we know at any time? Much more, or so I believe, than we know we know.”\n\nAgatha Christie,The Moving Finger\n\nThe literature of the fantastic abounds in inanimate objects magically endowed with the gift of speech. From Ovid's statue of Pygmalion to Mary Shelley's story about\n\nFrankenstein, we continually reinvent stories about creating something and then having a chat with it. Legend has it that after finishing his sculpture Moses, Michelangelo thought it so lifelike that he tapped it on the knee and commanded it to speak. Perhaps this shouldn't be surprising. Language is the mark of humanity and sentience. conversation is the most fundamental arena of language, the first kind of lan-guage we learn as children, and the kind we engage in constantly, whether we are teaching or learning, or-dering lunch, or talking with our families or friends.\n\nThis chapter introduces the **Large** **Language**\n\n\n![](/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsLzJiNGFjYTk4NmE4NDcyNjcuanBn)\n\n**Model,** **or** **LLM,** a computational agent that can in-teract conversationally with people. The fact that LLMs are designed for interaction with people has strong implications for their design and use.\n\nMany of these implications already became clear in a computational systemfrom 60 years ago, ELIZA (Weizenbaum, 1966). ELIZA, designed to simulate a Rogerian psychologist,illustrates a number of important issues with chatbots. For example people became deeply emotionally involved and conducted very personal conversa-tions,even to the extent of asking Weizenbaum to leave the room while they were typing. These issues of emotional engagement and privacy mean we need to think carefully about how we deploy language models and consider their effect on the people who are interacting with them.\n\nIn this chapter we begin by introducing thecomputational principles of LLMs; we'll discuiss their implementation in the transformer architecture in the following chapter. The central new idea that makes LLMs possible is the idea of **pretraining,** so let's begin by thinking about the idea of learning from text,the basic way that LLMs are trained.\n\nWe know that fluent speakers of a language bring an enormous amount of knowl-edge to bear during comprehension and production. This knowledge is embodied in many forms, perhaps most obviously in the vocabulary, the rich representations we have of words and their meanings and usage. This makes the vocabulary a useful lens to explore the acquisition of knowledge from text, by both people and machines.\n\nEstimates of the size of adult vocabularies vary widlely both within and across languages. For example, estimates of the vocabulary size of young adult speakers of American English range from 30,000 to 100,000 depending on the resources used to make the estimate and the definition of what it means to know a word. A sim-ple consequence of these facts is that children have to learn about 7 to 10 words a day,every single day, to arrive at observed vocabulary levels by the time they are 20years of age. And indeed empirical estimates of vocabulary growth in late elemen-tary through high school are consistent with this rate. How do children achieve this rate of vocabulary growth? Research suggests that the bulk of this knowledge acqui-sition happens as a by-product of reading. Reading is a process of rich contextual processing; we don't learn words one at a time in isolation. In fact, at some points during learning the rate of vocabulary growth exceeds the rate at which new words are appearing to the learner! That suggests that every time we read a word, we are also strengthening our understanding of other words that are associated with it.\n\n<!-- **2** CHAPTER 7 ·LARGE LANGUAGE MODELS -->\n\nSuch facts are consistent with the distributional hypothesis of Chapter 5,which proposes that some aspects of meaning can be learned solely from the texts we en-counter over our lives, based on the complex association of words with the words they co-occur with (and with the words that those words occur with). The distribu-tional hypothesis suggests both that we can acquire remarkable amounts of knowl-edge from text, and that this knowledge can be brought to bear long after its initial acquisition. Of course, grounding from real-world interaction or other modalities can help build even more powerful models, but even text alone is remarkably useful.\n\n## pretraining\n\nWhat made the modern NLP revolution possible is that large language models can learn all this knowledge of language, context, and the world simply by being taught to predict the next word, again and again, based on context, in a (very) large corpus of text. In this chapter and the next we formalize this idea that we'll call pretraining-learning knowledge about language and the world from iteratively predicting tokens in vast amounts of text-and call the resulting pretrained models **large** **language** **models.** Large language models exhibit remarkable performance on natural language tasks because of the knowledge they learn in pretraining.\n\nWhat can language models learn from word prediction? Consider the examples below. What kinds of knowledge do you think the model might pick up from learn-ing to predict what word fills the underbar (the correct answer is shown in blue)? Think about this for each example before you read ahead to the next paragraph:.\n\nWith roses, dahlias, and peonies, I was surrounded byflowers\n\nThe room wasn't just big it wasenormous\n\nThe square root of 4 is2\n\n## The author of \"A Room of One's ODwn\"isVirginia Woolf\n\nThe professor said thathe\n\nFrom the first sentence a model can learn ontological facts like that roses and dahlias and peonies are all kinds of flowers. From the second, a model could learn that “enormous” means something on the same scale as big but further along on the scale. From the third sentence, the system could learn math, while from the 4th sentence facts about the world and historical authors. Finally,the last sentence, if a model was exposed to such sentences repeatedly, it might learn to associate professors only with mnale pronouns, or other kinds of associations that might cause models to act unfairly to different people.\n\n**What** **is** a **large** **language** **model?** As we saw back in Chapter 3, a language model is simply a computational system that can predict the next word from previous words. That is, given a context or prefix of words, a language model assigns a probability distribution over the possible next words. Fig. 7.1 sketches this idea.\n\nOf course we've already seen language models! We saw n-gram language mod-els in Chapter 3 and briefly touched on the feedforward network applied to language\n\n<!-- 3 -->\n\n<!-- p(w|context) output all .44 the .33 your .15 Transformer (or other decoder) that .08 input context So long and thanks for 2 -->\n![](/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsLzcwMzM1MTUxZGE5YzY0OWEuanBn)\n\n**Figure** 7.1 A large language modelis a neural network that takes as input a context or prefix, and outputs a distribution over possible next words.\n\nmodeling in Chapter 6. A large language model is just a (much) larger version of these. For example, in Chapter 3 we introduced bigram and trigram language mod-els that can predict words from the previous word or handful of words. By contrast, large language models can predict words given contexts of thousands or even tens of thousands of words!\n\nThe fundamental intuition of language models is that a model that can predict text (assigning a distribution over following words) can also be used to generate text by **sampling** from the distribution. Recall from Chapter 3 that sampling means to choose a word from a distribution.\n\n<!-- p(w|context) output .44 the .33 your .15 Transformer (or other decoder) that .08 So long and thanks for all p(w|context) output the .77 your .22 our .07 Transformer (or other decoder) of .02 So long and thanks for all the -->\n![](/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsLzY3YTEzYjNkZGE3ODk0MTEuanBn)\n\n**Figure** 7.2 Turning a predictive model that gives a probability distribution over next words into a generative model by repeatedly sampling from the distribution. The result is a left-to-right (also called autoregressive) language model. As each token is generated, it gets added onto the context as a prefix for generating the next token.\n\nFig. 7.2 shows the same example from Fig. 7.1, in which a language model is given a text prefix and generates a possible completion. The model selects the word all, adds that to the context, uses the updated context to get a new predictive distribution, and then selects the from that distribution and generates it, and so on. Notice that the model is conditioning on both the priming context and its own subsequently generated outputs.\n\nThis kind of setting in which we iteratively predict and generate words left-to-right from earlier words is often called **causal** or **autoregressive** language mod-els.(We will introduce alternative non-autoregressive models, like BERT and other masked language models that predict words using information from both the left and the right, in Chapter 9.)\n\n<!-- **4** CHAPTER 7 · LARGE LANGUAGE MODELS -->\n\n### generative AI\n\nThis idea of using computational models to generate text, as well as code,speech, and images, constitutes the important new area called **generative** **AI.** Applying LLMs to generate text has vastly broadened the scope of NLP, which historically was focused more on algorithms for parsing or understanding text rather than gen-eratingit.\n\nIn the rest of the chapter, we'll seethat almost any NLP task can be modeled as word prediction in a large language model, if we think about it in the right way, and we'll motivate and introduce the idea of **prompting** language models. We'll introduce specific algorithms for generating text from a language model, like **greedy** **decoding** and **sampling.** We'll introduce the details of **pretraining,the** way that language models are self-trained by iteratively being taught to guess the next word in the text from the prior words. We'll sketch out the other two stages of language model training: instruction tuning (also called supervised finetuning or SFT),and alignment, concepts that we'll return to in Chapter 10. And we'll see how to evaluate these models. Let's begin, though, by talking about different kinds of language models.\n\n### 7.1 Three architectures for language models\n\nThe architecture we sketched above for a left-to-right or autoregressive language model, which is the language model architecture we will define in this chapter, is actually only one of three common LM architectures.\n\nThe three architectures are the **encoder,** **the** **decoder,** and the **encoder-decoder.** Fig. 7.3 gives a schematic picture of the three.\n\n<table border=\"1\" ><tr>\n<td>WW W WW W W W<br>WW W W W W W W W W W W W<br>Decoder Encoder Encoder-Decoder<br><img src=\"/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsLzhjOWYxY2QyYjY2YTJiZTIuanBn\"><img src=\"/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsLzgwN2Q1ZjljYmEwMjkyYWEuanBn\"><img src=\"/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsL2U5ODlmYzAwMDcxZjA4ZDkuanBn\"></td>\n</tr></table>\n\n**Figure 7.3**Three architectures for language models: decoders, encoders, and encoder-decoders. The arrows sketch out the information flow in the three architectures. Decoders take tokens as input and generate tokens as output. Encoders take tokens as input and produce an encoding (a vector representation of each token) as output. Encoder-decoders take tokens as input and generate a series of tokens as output.\n\n**decoder**\n\nThe **decoder** is the architecture we've introduced above. It takes as input a series of tokens, and iteratively generates an output token one at a time. The decoder is the architecture used to create large language models like GPT, Claude,Llama,and Mistral. The information flow in decoders goes left-to-right, meaning that the model\n\n<!-- 7.3 · PROMPTING **7** -->\n\n<!-- prob Charles 2 token 2 token 2 Transformer (or other decoder) token 2 Q:Who wrote the book 'The Origin of Species' A: -->\n![](/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsLzY3YWU2OTUyZGM1NzhmNjYuanBn)\n\n**Figure** 7.5 Answering a question by computing the probabilities of the tokens after a prefix stating the question; in this example the correct token Charles has the highest probability.\n\nfollow instructions. This extra training is called **instruction-tuning.** In instruction-tuning we take a base language model that has been trained to predict words, and continue training it on a special dataset of instructions together with the appropriate response to each. The dataset has many examples of questions together with their answers, commands with their responses, and other examples of how to carry on a conversation. We'll discuss the details of instruction-tuning in Chapter 10.\n\n**prompt**\n\nLanguage models that have beeninstruction-tuned are very good at following instructions and answering questions and carrying on a conversation and can be **prompted.** **A** **prompt** is a text string that a user issues to a language model to get the model to do something useful. In prompting, the user's prompt string is passed to the language model, which iteratively generates tokens conditioned on the prompt. The process of finding effective prompts for a task is known as **prompt engineering.**\n\nAs suggested above when we introduced conditional generation, a prompt can be a question (like “What is a transformer network?\"), possibly in a struc-tured format (like “Q: What is a transformer network? A:\"). A prompt can also be an instruction (like “Translate the following sentence into Hindi: 'Chop the garlic finely'\").\n\nMore explicit prompts that specify the set of possible answers lead to better performance. For example, here is a prompt template to do sentiment analysis that prespecifies the potential answers:\n\n<table border=\"1\" ><tr>\n<td>A prompt consisting of a review plus an incomplete statement</td>\n</tr><tr>\n<td>Human: Do you think that “input” has negative or positive sentiment?<br>Choices:<br>(P) Positive<br>(N)Negative<br>Assistant: I believe the best answer is:(</td>\n</tr></table>\n\nThis prompt uses a number of more sophisticated prompting characteristics. It specifies the two allowable choices (P) and (N), and ends the prompt with the open parenthesis that strongly suggests the answer will be (P) or (N). Note that it also specifies the role of the language model as an assistant.\n\nIncluding some labeled examples in the prompt can also improve performance. We call such examples **demonstrations.** The task of prompting with examples is sometimes called **few-shot** **prompting,** as contrasted with **zero-shot** prompting which means instructions that don't include labeled examples. For example Fig. 7.6\n\n<!-- prompt -->\n\n<!-- engineering -->\n\n<!-- **demonstrations** -->\n\n<!-- **few-shot** -->\n\n<!-- zero-shot -->\n\n<!-- 7.5 · TRAINING LARGE LANGUAGE MODELS 17 -->\n\n**common crawl**\n\nWeb text is usualy taken from corpora of automatically-crawled web pages like **the** **common** **crawl,** a series of snapshots of the entire web produced by the non-profit Common Crawl (https://commoncrawl.org/) that each have billions of webpages. Various versions of common crawl data exist, suich as the Colossal Clean Crawled Corpus (C4; Raffel et al. 2020), a corpus of 156 billion tokens of English that is filtered in various ways (deduplicated, removing non-natural language like code,sentences with offensive words from a blocklist). This C4 corpus seems to consist in large part of patent text documents, Wikipedia, and news sites (Dodge et al.,2021).\n\nThe Pile\n\nWikipedia plays a role in lots of language model training, as do corpora of books. **The** **Pile** (Gao et al., 2020) is an 825 GB English text corpus that is constructed by publicly released code, containing again a large amount of text scraped from the web as well as books and Wikipedia; Fig. 7.14 shows its composition. Dolma is a larger open corpus of English, created with public tools, containing three trillion tokens, which similarly consists of web text, academic papers, code, books, encyclopedic materials, and social media (Soldaini et al., 2024).\n\n<!-- Bibliotik Pile-CC PG-19 BC2 PubMed Central ArXiv Subtitles StackExchange IRC EP PMA Github FreeLaw USPTO Phil NIH OpenWebText2 Wikipedia DM Math HN YT -->\n![](/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsL2I2ZWVlMDc1NzJlNDNmZjkuanBn)\n\n**Figure 7.14** The Pile corpus, showing the size of different components, color coded as academic (articles from PubMed and ArXiv, patents from the USPTA; internet (webtext in-cluding a subset of the common crawl as well as Wikipedia), prose (a large corpus of books), dialogue (including movie subtitles and chat data), and misc.. Figure from Gao et al. (2020).\n\n**Filtering** **for** **quality** **and** **safety** Pretraining data drawn from the web is filtered for both quality and safety. Quality filters are classifiers that assign a score to each document. Quality is of course subjective, so different quality filters are trained in different ways, but often to value high-quality reference corpora like Wikipedia, PII books,and particular websites and to avoid websites with lots ofPII (Personal Iden-tifiable Information) or adult content. Filters also remove boilerplate text which is very frequent on the web. Another kind of quality filtering is deduplication,which can be done at various levels, so as to remove duplicate documents, duplicate web pages, or duplicate text. Quality filtering generally improves language model per-formance (Longpre et al., 2024b; Llama Team, 2024).\n\nSafety filtering is again a subjective decision, and often includes **toxicity** detec-tion based on running off-the-shelf toxicity classifiers. This can have mixed results. One problem is that current toxicity classifiers mistakenly flag non-toxic data if it\n\n",
      "metadata": {
        "data_source": {
          "record_locator": {
            "protocol": "file",
            "remote_file_path": "temp/7-1_merged.pdf"
          },
          "url": "file://temp/7-1_merged.pdf"
        },
        "filename": "a11fc441d8364f4f8b6db75176.pdf",
        "filetype": "application/pdf",
        "page_count": 6
      },
      "schema_version": "1.3.0",
      "success_count": 6,
      "summary": {
        "duration_ms": 1586
      }
    }
  },
  {
    "label": "Image Parser",
    "url": "https://cdn.xparse.ai/c1be6ed23d61198e6186efcd510be2841744204.jpeg",
    "thumb": "https://cdn.xparse.ai/c1be6ed23d61198e6186efcd510be2841744204.jpeg",
    "type": "image/jpeg",
    "filename": "image_sample.jpeg",
    "markdown": "Healthy Sleep Tips\n\nWhat You Can Do\n\nWhy Sleep Matters\n\nQuality sleep improves memory, mood, and overall health. Poor sleep can raise stress and weaken the immune system.\n\n*[Image: This image shows a simple clock face against a light orange background. The clock hands indicate approximately 10:10. There are no other background elements or details, suggesting the focus is on the clock itself. The clock's design is minimalist, without any additional embellishments or textures.]*\n12:00\n\nMyths vs. Facts\n\nMyths\n\nFacts\n\nImpact of Poor Sleep\n\n**×** You can function well on 4-5 hours of sleep\n\n× Napping always makes you lazy\n\n× Snoring is harmless\n\nAdults need 7-9 hours for optimal health\n\nShort naps can boost energy and focus\n\nSNoring can signal sleep disorders\n\n**Lack of sleep**\nharm emotional well-being, reduce productivity, and increase health risks like hypertension.\n\nHow to Improve Your Sleep\n\n*[Image: This image shows a simple clock face against a plain background. The clock hands point to approximately 10:10, without any additional numbers or markings. The clock face is circular with 12 hour markers, each represented by simple lines. The clock hands are standard, without any ornamentation or complex design. There are no other objects or background elements in the image.]*\n12:00\n\nWhen to Seek Help\n\n*[Image: This image shows a simple clock face against a light green background. The clock hands are green, with the hour hand pointing to 12 o'clock and the minute hand pointing to 6 o'clock, indicating approximately 12:30. The clock face is white with black numerals and hands. There are no other identifiable objects or background elements in the image.]*\n12:50\n\nMaintain consistent sleep schedules\n\nReduce screen exposure before bed\n\nCreate a calm sleeping environment\n\nLimit caffeine in the evening\n\nPersistent insomnia\n\nLoud or chronic snoring\n\nDaytime fatigue despite long sleep\n\nMood or memory issues connected to sleep\n\nBook a consultation to improve your sleep today.\n\nContact: info@example.com | (555) 123-4567",
    "result_json": {
      "markdown": "Healthy Sleep Tips\n\nWhat You Can Do\n\nWhy Sleep Matters\n\nQuality sleep improves memory, mood, and overall health. Poor sleep can raise stress and weaken the immune system.\n\n*[Image: This image shows a simple clock face against a light orange background. The clock hands indicate approximately 10:10. There are no other background elements or details, suggesting the focus is on the clock itself. The clock's design is minimalist, without any additional embellishments or textures.]*\n12:00\n\nMyths vs. Facts\n\nMyths\n\nFacts\n\nImpact of Poor Sleep\n\n**×** You can function well on 4-5 hours of sleep\n\n× Napping always makes you lazy\n\n× Snoring is harmless\n\nAdults need 7-9 hours for optimal health\n\nShort naps can boost energy and focus\n\nSNoring can signal sleep disorders\n\n**Lack of sleep**\nharm emotional well-being, reduce productivity, and increase health risks like hypertension.\n\nHow to Improve Your Sleep\n\n*[Image: This image shows a simple clock face against a plain background. The clock hands point to approximately 10:10, without any additional numbers or markings. The clock face is circular with 12 hour markers, each represented by simple lines. The clock hands are standard, without any ornamentation or complex design. There are no other objects or background elements in the image.]*\n12:00\n\nWhen to Seek Help\n\n*[Image: This image shows a simple clock face against a light green background. The clock hands are green, with the hour hand pointing to 12 o'clock and the minute hand pointing to 6 o'clock, indicating approximately 12:30. The clock face is white with black numerals and hands. There are no other identifiable objects or background elements in the image.]*\n12:50\n\nMaintain consistent sleep schedules\n\nReduce screen exposure before bed\n\nCreate a calm sleeping environment\n\nLimit caffeine in the evening\n\nPersistent insomnia\n\nLoud or chronic snoring\n\nDaytime fatigue despite long sleep\n\nMood or memory issues connected to sleep\n\nBook a consultation to improve your sleep today.\n\nContact: info@example.com | (555) 123-4567",
      "detail": [
        {
          "type": "paragraph",
          "text": "Healthy Sleep Tips",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-0"
        },
        {
          "type": "paragraph",
          "text": "What You Can Do",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-1"
        },
        {
          "type": "paragraph",
          "text": "Why Sleep Matters",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-2"
        },
        {
          "type": "paragraph",
          "text": "Quality sleep improves memory, mood, and overall health. Poor sleep can raise stress and weaken the immune system.",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-3"
        },
        {
          "type": "paragraph",
          "text": "*[Image: This image shows a simple clock face against a light orange background. The clock hands indicate approximately 10:10. There are no other background elements or details, suggesting the focus is on the clock itself. The clock's design is minimalist, without any additional embellishments or textures.]*\n12:00",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-4"
        },
        {
          "type": "paragraph",
          "text": "Myths vs. Facts",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-5"
        },
        {
          "type": "paragraph",
          "text": "Myths",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-6"
        },
        {
          "type": "paragraph",
          "text": "Facts",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-7"
        },
        {
          "type": "paragraph",
          "text": "Impact of Poor Sleep",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-8"
        },
        {
          "type": "paragraph",
          "text": "**×** You can function well on 4-5 hours of sleep",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-9"
        },
        {
          "type": "paragraph",
          "text": "× Napping always makes you lazy",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-10"
        },
        {
          "type": "paragraph",
          "text": "× Snoring is harmless",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-11"
        },
        {
          "type": "paragraph",
          "text": "Adults need 7-9 hours for optimal health",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-12"
        },
        {
          "type": "paragraph",
          "text": "Short naps can boost energy and focus",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-13"
        },
        {
          "type": "paragraph",
          "text": "SNoring can signal sleep disorders",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-14"
        },
        {
          "type": "paragraph",
          "text": "**Lack of sleep**\nharm emotional well-being, reduce productivity, and increase health risks like hypertension.",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-15"
        },
        {
          "type": "paragraph",
          "text": "How to Improve Your Sleep",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-16"
        },
        {
          "type": "paragraph",
          "text": "*[Image: This image shows a simple clock face against a plain background. The clock hands point to approximately 10:10, without any additional numbers or markings. The clock face is circular with 12 hour markers, each represented by simple lines. The clock hands are standard, without any ornamentation or complex design. There are no other objects or background elements in the image.]*\n12:00",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-17"
        },
        {
          "type": "paragraph",
          "text": "When to Seek Help",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-18"
        },
        {
          "type": "paragraph",
          "text": "*[Image: This image shows a simple clock face against a light green background. The clock hands are green, with the hour hand pointing to 12 o'clock and the minute hand pointing to 6 o'clock, indicating approximately 12:30. The clock face is white with black numerals and hands. There are no other identifiable objects or background elements in the image.]*\n12:50",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-19"
        },
        {
          "type": "paragraph",
          "text": "Maintain consistent sleep schedules",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-20"
        },
        {
          "type": "paragraph",
          "text": "Reduce screen exposure before bed",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-21"
        },
        {
          "type": "paragraph",
          "text": "Create a calm sleeping environment",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-22"
        },
        {
          "type": "paragraph",
          "text": "Limit caffeine in the evening",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-23"
        },
        {
          "type": "paragraph",
          "text": "Persistent insomnia",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-24"
        },
        {
          "type": "paragraph",
          "text": "Loud or chronic snoring",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-25"
        },
        {
          "type": "paragraph",
          "text": "Daytime fatigue despite long sleep",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-26"
        },
        {
          "type": "paragraph",
          "text": "Mood or memory issues connected to sleep",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-27"
        },
        {
          "type": "paragraph",
          "text": "Book a consultation to improve your sleep today.",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-28"
        },
        {
          "type": "paragraph",
          "text": "Contact: info@example.com | (555) 123-4567",
          "bbox": [
            0,
            0,
            100,
            20
          ],
          "page_id": 0,
          "position": "vlm-29"
        }
      ],
      "pages": [
        {
          "page_id": 0,
          "width": 595,
          "height": 842,
          "image": "",
          "angle": 0
        }
      ],
      "status": "done"
    }
  },
  {
    "label": "Invoice Parser",
    "url": "https://cdn.xparse.ai/General_Businesses_Invoice_Format.webp",
    "thumb": "https://cdn.xparse.ai/General_Businesses_Invoice_Format.webp",
    "type": "image/webp",
    "filename": "invoice_sample.webp",
    "markdown": "<table border=\"1\" ><tr>\n<td colspan=\"11\">Page No. I of I TAX INVOICE Original Copy</td>\n</tr><tr>\n<td colspan=\"11\">Add Company Name<br>Add Add Address<br>Logo Mobile: +91 9999999999 | Email: company@gmail.com<br>GSTIN - 29AAAAA1234F000 | PAN - 29AAAAAI234F</td>\n</tr><tr>\n<td colspan=\"5\">Invoice Number : PPP/0001/25-26<br>Invoice Date : 22-Apr-25<br>Due date : 07-May-25<br>PlaceofSupply : 09 - Uttar Pradesh<br>Reverse Charge : No<br>Optional Field 1<br>Optional Field 2 :<br>Optional Field 3 :</td>\n<td colspan=\"6\">Transporter Details<br>Transporter : Sanjay Transportation<br>Vehicle No. : TMP000001<br>Transporter Doc No. : DOCNO1234<br>Transporter Doc Date : 2025-04-22<br>E-Way Bill No. : 101019999999<br>E-Way Bill Date : 2025-04-22</td>\n</tr><tr>\n<td colspan=\"5\">Billing Details<br>Name<br>GSTIN: | Mobile: +91| Email:<br>Add Address</td>\n<td colspan=\"6\">Shipping Details<br>Name<br>GSTIN: | Mobile: +91 | Email:<br>Add Address</td>\n</tr><tr>\n<td colspan=\"11\">IRN-f3866a8e310af0393d|dc43087ed8b59a666d7f9abafgdgd666djnsha776gsg |Ack No.- 112510299999999 | Ack Date- 2025-04-22</td>\n</tr><tr>\n<td>Sr.</td>\n<td colspan=\"2\">Item Description</td>\n<td>HSN/SAC</td>\n<td colspan=\"2\">Qty</td>\n<td>Unit</td>\n<td>List Price</td>\n<td>Disc.</td>\n<td>Tax %</td>\n<td>Amount (₹)</td>\n</tr><tr>\n<td>-</td>\n<td colspan=\"2\">Item Description </td>\n<td>85076000</td>\n<td colspan=\"2\">1.00</td>\n<td>Box</td>\n<td>100000.00</td>\n<td></td>\n<td>18.00</td>\n<td>118000.00</td>\n</tr><tr>\n<td></td>\n<td colspan=\"10\">Discount - 1200.00</td>\n</tr><tr>\n<td colspan=\"11\">Total 1,16,800.00</td>\n</tr><tr>\n<td colspan=\"11\">Rs. One Lakh Sixteen Thousand Eight Hundred Only<br>Settled by - Bank : 100000.00 | Invoice Balance :$16,800.00$Sale @$18\\%=100000.00,$,<br>$IGST=18000.00$ | Total $Sal1.ax18.Css.Add.Css.$</td>\n</tr><tr>\n<td colspan=\"2\">Terms and Conditions<br>E & O.E<br>I. Goods once sold will not be taken back.<br>2. Interest @ 18% p.a.will be charged if the payment for<br>Company Name is not made within the stipulated time.<br>3. Subject to<br>'Delhi' Jurisdiction<br>only.</td>\n<td colspan=\"3\">Account Number:<br>123456789<br>Bank: ICICI Bank<br>IFSC: ICICI1234<br>Branch: Noida<br>Name: Add Name<br><img src=\"/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsL2ZjYTlhOTUxODFmMjg3YzEuanBn\"></td>\n<td colspan=\"6\">E-Invoice QR<br>For Company Name Signature <img src=\"/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsLzE3ZWQ4ZDYyMmRkMTA5NjkuanBn\"></td>\n</tr></table>\n\n<!-- Invoice Created by www.mazu.in -->",
    "result_json": {
      "elements": [
        {
          "coordinates": [
            0.043496,
            0.032782,
            0.952074,
            0.031072,
            0.952074,
            0.968643,
            0.047523,
            0.969498
          ],
          "element_id": "f922854b26a2c312a3c2dabd23dc752e5e8211a4878bb26c79f02cf5f712e065",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/General_Businesses_Invoice_Format.webp"
              },
              "url": "file://temp/General_Businesses_Invoice_Format.webp"
            },
            "is_continuation": false
          },
          "page_number": 1,
          "sub_type": "bordered",
          "text": "<table border=\"1\" ><tr>\n<td colspan=\"11\">Page No. I of ITAX INVOICEOriginal Copy</td>\n</tr><tr>\n<td colspan=\"11\">Add Company NameAddAdd AddressLogoMobile: +91 9999999999 | Email: company@gmail.comGSTIN - 29AAAAA1234F000 | PAN - 29AAAAAI234F</td>\n</tr><tr>\n<td colspan=\"5\">Invoice Number: PPP/0001/25-26Invoice Date: 22-Apr-25Due date: 07-May-25PlaceofSupply: 09 - Uttar PradeshReverse Charge: NoOptional Field 1Optional Field 2:Optional Field 3:</td>\n<td colspan=\"6\">Transporter DetailsTransporter: Sanjay TransportationVehicle No.: TMP000001Transporter Doc No.: DOCNO1234Transporter Doc Date: 2025-04-22E-Way Bill No.: 101019999999E-Way Bill Date: 2025-04-22</td>\n</tr><tr>\n<td colspan=\"5\">Billing DetailsNameGSTIN:| Mobile: +91| Email:Add Address</td>\n<td colspan=\"6\">Shipping DetailsNameGSTIN:| Mobile: +91| Email:Add Address</td>\n</tr><tr>\n<td colspan=\"11\">IRN-f3866a8e310af0393d|dc43087ed8b59a666d7f9abafgdgd666djnsha776gsg |Ack No.- 112510299999999 | Ack Date- 2025-04-22</td>\n</tr><tr>\n<td>Sr.</td>\n<td colspan=\"2\">Item Description</td>\n<td>HSN/SAC</td>\n<td colspan=\"2\">Qty</td>\n<td>Unit</td>\n<td>List Price</td>\n<td>Disc.</td>\n<td>Tax %</td>\n<td>Amount (₹)</td>\n</tr><tr>\n<td>-</td>\n<td colspan=\"2\">Item Description </td>\n<td>85076000</td>\n<td colspan=\"2\">1.00</td>\n<td>Box</td>\n<td>100000.00</td>\n<td></td>\n<td>18.00</td>\n<td>118000.00</td>\n</tr><tr>\n<td></td>\n<td colspan=\"10\">Discount- 1200.00</td>\n</tr><tr>\n<td colspan=\"11\">Total1,16,800.00</td>\n</tr><tr>\n<td colspan=\"11\">Rs. One Lakh Sixteen Thousand Eight Hundred OnlySettled by - Bank : 100000.00 | Invoice Balance :$16,800.00$Sale @$18\\%=100000.00,$,$IGST=18000.00$ | Total$Sal1.ax18.Css.Add.Css.$</td>\n</tr><tr>\n<td colspan=\"2\">Terms and ConditionsE & O.EI. Goods once sold will not betaken back.2. Interest @ 18% p.a.will becharged if the payment forCompany Name is not madewithin the stipulated time.3. Subject to'Delhi' Jurisdictiononly.</td>\n<td colspan=\"3\">Account Number:123456789Bank: ICICI BankIFSC: ICICI1234Branch: NoidaName: Add Name</td>\n<td colspan=\"6\">E-Invoice QRFor Company NameSignature</td>\n</tr></table>",
          "type": "Table"
        },
        {
          "coordinates": [
            0.376561,
            0.984322,
            0.616593,
            0.984322,
            0.616593,
            0.995154,
            0.376561,
            0.995154
          ],
          "element_id": "e82ae39d6c8c85ea894a84a4576c01a6221c433575396f1a8d08a2e7fa2b8a30",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/General_Businesses_Invoice_Format.webp"
              },
              "url": "file://temp/General_Businesses_Invoice_Format.webp"
            },
            "is_continuation": false
          },
          "page_number": 1,
          "text": "Invoice Created by www.mazu.in",
          "type": "Footer"
        }
      ],
      "markdown": "<table border=\"1\" ><tr>\n<td colspan=\"11\">Page No. I of I TAX INVOICE Original Copy</td>\n</tr><tr>\n<td colspan=\"11\">Add Company Name<br>Add Add Address<br>Logo Mobile: +91 9999999999 | Email: company@gmail.com<br>GSTIN - 29AAAAA1234F000 | PAN - 29AAAAAI234F</td>\n</tr><tr>\n<td colspan=\"5\">Invoice Number : PPP/0001/25-26<br>Invoice Date : 22-Apr-25<br>Due date : 07-May-25<br>PlaceofSupply : 09 - Uttar Pradesh<br>Reverse Charge : No<br>Optional Field 1<br>Optional Field 2 :<br>Optional Field 3 :</td>\n<td colspan=\"6\">Transporter Details<br>Transporter : Sanjay Transportation<br>Vehicle No. : TMP000001<br>Transporter Doc No. : DOCNO1234<br>Transporter Doc Date : 2025-04-22<br>E-Way Bill No. : 101019999999<br>E-Way Bill Date : 2025-04-22</td>\n</tr><tr>\n<td colspan=\"5\">Billing Details<br>Name<br>GSTIN: | Mobile: +91| Email:<br>Add Address</td>\n<td colspan=\"6\">Shipping Details<br>Name<br>GSTIN: | Mobile: +91 | Email:<br>Add Address</td>\n</tr><tr>\n<td colspan=\"11\">IRN-f3866a8e310af0393d|dc43087ed8b59a666d7f9abafgdgd666djnsha776gsg |Ack No.- 112510299999999 | Ack Date- 2025-04-22</td>\n</tr><tr>\n<td>Sr.</td>\n<td colspan=\"2\">Item Description</td>\n<td>HSN/SAC</td>\n<td colspan=\"2\">Qty</td>\n<td>Unit</td>\n<td>List Price</td>\n<td>Disc.</td>\n<td>Tax %</td>\n<td>Amount (₹)</td>\n</tr><tr>\n<td>-</td>\n<td colspan=\"2\">Item Description </td>\n<td>85076000</td>\n<td colspan=\"2\">1.00</td>\n<td>Box</td>\n<td>100000.00</td>\n<td></td>\n<td>18.00</td>\n<td>118000.00</td>\n</tr><tr>\n<td></td>\n<td colspan=\"10\">Discount - 1200.00</td>\n</tr><tr>\n<td colspan=\"11\">Total 1,16,800.00</td>\n</tr><tr>\n<td colspan=\"11\">Rs. One Lakh Sixteen Thousand Eight Hundred Only<br>Settled by - Bank : 100000.00 | Invoice Balance :$16,800.00$Sale @$18\\%=100000.00,$,<br>$IGST=18000.00$ | Total $Sal1.ax18.Css.Add.Css.$</td>\n</tr><tr>\n<td colspan=\"2\">Terms and Conditions<br>E & O.E<br>I. Goods once sold will not be taken back.<br>2. Interest @ 18% p.a.will be charged if the payment for<br>Company Name is not made within the stipulated time.<br>3. Subject to<br>'Delhi' Jurisdiction<br>only.</td>\n<td colspan=\"3\">Account Number:<br>123456789<br>Bank: ICICI Bank<br>IFSC: ICICI1234<br>Branch: Noida<br>Name: Add Name<br><img src=\"/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsL2ZjYTlhOTUxODFmMjg3YzEuanBn\"></td>\n<td colspan=\"6\">E-Invoice QR<br>For Company Name Signature <img src=\"/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsLzE3ZWQ4ZDYyMmRkMTA5NjkuanBn\"></td>\n</tr></table>\n\n<!-- Invoice Created by www.mazu.in -->\n\n",
      "metadata": {
        "data_source": {
          "record_locator": {
            "protocol": "file",
            "remote_file_path": "temp/General_Businesses_Invoice_Format.webp"
          },
          "url": "file://temp/General_Businesses_Invoice_Format.webp"
        },
        "filename": "f98254308fbb4f7dae01518cf3.webp",
        "filetype": "image/webp",
        "page_count": 1
      },
      "schema_version": "1.3.0",
      "success_count": 1,
      "summary": {
        "duration_ms": 1577
      }
    }
  },
  {
    "label": "Resume Parser",
    "url": "https://cdn.xparse.ai/paris-resume-templates.webp",
    "thumb": "https://cdn.xparse.ai/paris-resume-templates.webp",
    "type": "image/webp",
    "filename": "resume_sample.webp",
    "markdown": "![](/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsLzcyZDcwMjFjNzBlMWFkMWMuanBn)\n\n# Susan Stone, Marketing Manager\n\n77 SERIAL DRIVE, AUSTIN, TX 78705, UNITED STATES·susan.12@gmail.com·(512)465-6312\n\n# PROFILE\n\nExperienced and energetic Marketing Manager with over seven years of experience effectively managing marketing projects from conception to completion. Adept in using digital marketing platforms to increase sales and overall company productivity. Experienced in preparing and overseeing online and print marketing campaigns, resulting in an increase in partner relations for the company. Adept in monitoring and reporting marketing objectives, to maintain necessary internal communications within the company. Pragmatic and result oriented,I am determined to build market presence in the next company I join.\n\n# EMPLOYMENT HISTORY\n\n## Marketing Manager, Zane Telecommunications\n\n## Nov 2011-Aug 2019,Austin\n\n·Effectively managed creative projects, promoting a superior corporate image.\n\n·Designed and implemented direct mail campaigns, resulting in a 10% sales increase per quarter.\n\n·Developed and maintained internal and external relationships, which were crucial to company enhancement and success.\n\n·Assessed the strategies of competitors, while avidly working to increase our own productivity.\n\n# Online Marketing Consultant, Freelance\n\nAug 2009-Jun 2017,Telecommute\n\n·Researched the mnotivations of users and consumers to better understand company goals.\n\n·Put forth carefully planned strategies to improve company business.\n\n·Fostering relationships to maintain existing clients, while developing new relationships to attract potential clients.\n\n·Planned, executed, and led online marketing tactics, resulting in wide range company advancements.\n\n## Sales and Marketing Director, Bee Hive Printing\n\nOct 2009-Oct 2011,Dallas\n\n·Oversaw sales, marketing, and business development goals.\n\n·Planned strategies to develop new markets for printing.\n\n·Successfully planned and executed over 15 trade shows.\n\n·increased brand presence, resulting in higher sales and more advantageous relationships. **SKILLS**\n\n## EDUCATION\n\n## Harvard College, Master of Marketing\n\nCommunication Skills\n\nProject Management \n\nSkills\n\nCreativity and Problem \n\nSolving\n\nDigital Marketing\n\nIndustry Trends & Sales \n\nForecasting\n\nAug 2009-Aug 2012,Cambridge\n\n·Winner of the 2004 Hackley Fellowship.\n\n<!-- Excellent -->",
    "result_json": {
      "elements": [
        {
          "coordinates": [
            0.073611,
            0.037819,
            0.186806,
            0.037819,
            0.186806,
            0.118369,
            0.073611,
            0.118369
          ],
          "element_id": "6bc8f8a56ef13c6b05bc5c643c126d522232c8a6a82ceb7a534ab77ac9f36271",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "height": 164,
            "is_continuation": false,
            "width": 163
          },
          "page_number": 1,
          "text": "",
          "type": "Image"
        },
        {
          "coordinates": [
            0.21875,
            0.038802,
            0.552083,
            0.038802,
            0.552083,
            0.092829,
            0.21875,
            0.092829
          ],
          "element_id": "e1b3559dd0abeee52a80f5088624c445878b3631d1212f3caa720e3d35235829",
          "metadata": {
            "category_depth": 0,
            "children_ids": [
              "d38dba7f8edc4cc71b37ef2058da756967d887b5ea10f08ab33c0615dae7c297"
            ],
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false
          },
          "page_number": 1,
          "text": "Susan Stone, Marketing Manager",
          "type": "Title"
        },
        {
          "coordinates": [
            0.219444,
            0.104126,
            0.553472,
            0.104126,
            0.553472,
            0.124754,
            0.219444,
            0.124754
          ],
          "element_id": "d38dba7f8edc4cc71b37ef2058da756967d887b5ea10f08ab33c0615dae7c297",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "e1b3559dd0abeee52a80f5088624c445878b3631d1212f3caa720e3d35235829"
          },
          "page_number": 1,
          "text": "77 SERIAL DRIVE, AUSTIN, TX 78705, UNITED STATES·susan.12@gmail.com·(512)465-6312",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.072917,
            0.167485,
            0.171528,
            0.167485,
            0.171528,
            0.178291,
            0.072917,
            0.178291
          ],
          "element_id": "3077ef4508cadd10aa90d5aeb2df406ed28afd045f649220f097db1ac771f3a0",
          "metadata": {
            "category_depth": 0,
            "children_ids": [
              "bab1a80a2f9f5d19c264294bf34d68e615a8136ff2185b79a4d07743a21eb04c"
            ],
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false
          },
          "page_number": 1,
          "text": "PROFILE",
          "type": "Title"
        },
        {
          "coordinates": [
            0.072222,
            0.197937,
            0.665278,
            0.197937,
            0.665278,
            0.301081,
            0.072222,
            0.301081
          ],
          "element_id": "bab1a80a2f9f5d19c264294bf34d68e615a8136ff2185b79a4d07743a21eb04c",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "3077ef4508cadd10aa90d5aeb2df406ed28afd045f649220f097db1ac771f3a0"
          },
          "page_number": 1,
          "text": "Experienced and energetic Marketing Manager with over seven years of experience effectively managing marketing projects from conception to completion. Adept in using digital marketing platforms to increase sales and overall company productivity. Experienced in preparing and overseeing online and print marketing campaigns, resulting in an increase in partner relations for the company. Adept in monitoring and reporting marketing objectives, to maintain necessary internal communications within the company. Pragmatic and result oriented,I am determined to build market presence in the next company I join.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.072917,
            0.336444,
            0.339583,
            0.336444,
            0.339583,
            0.34725,
            0.072917,
            0.34725
          ],
          "element_id": "fd9e7192a1a7f08f411ae4c97a18426454d7b0302f38075af26b840b1892c45c",
          "metadata": {
            "category_depth": 0,
            "children_ids": [
              "a33563deededf2974757e38f7f365da0bcebfe80d6dcedf9c19e7529d4f08003",
              "4638c27e2ab47769aac104c08d5f2ed958c0fd419ed1347083b248e816b7e1cb"
            ],
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false
          },
          "page_number": 1,
          "text": "EMPLOYMENT HISTORY",
          "type": "Title"
        },
        {
          "coordinates": [
            0.072917,
            0.369352,
            0.497222,
            0.369352,
            0.497222,
            0.383104,
            0.072917,
            0.383104
          ],
          "element_id": "a33563deededf2974757e38f7f365da0bcebfe80d6dcedf9c19e7529d4f08003",
          "metadata": {
            "category_depth": 1,
            "children_ids": [],
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "fd9e7192a1a7f08f411ae4c97a18426454d7b0302f38075af26b840b1892c45c"
          },
          "page_number": 1,
          "text": "Marketing Manager, Zane Telecommunications",
          "type": "Title"
        },
        {
          "coordinates": [
            0.074306,
            0.393418,
            0.258333,
            0.393418,
            0.258333,
            0.404224,
            0.074306,
            0.404224
          ],
          "element_id": "4638c27e2ab47769aac104c08d5f2ed958c0fd419ed1347083b248e816b7e1cb",
          "metadata": {
            "category_depth": 1,
            "children_ids": [
              "064f488528b60501646fb7623784f940f5dc5827ed83dce84ee7abe08b260b8a",
              "1e9d974d85c0c91ccb3b4097e28f8de841c76a806c21269b5a44fdb8c974956b",
              "349e1b77dc2d2d3e36cbb6ac4a20c9a32f3ccb4be6b67169e43e94aa501b3873",
              "6aa721a8d84abeee7b0bcd300a80666334808f839927a665aee279a87fa63f4a"
            ],
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "fd9e7192a1a7f08f411ae4c97a18426454d7b0302f38075af26b840b1892c45c"
          },
          "page_number": 1,
          "text": "Nov 2011-Aug 2019,Austin",
          "type": "Title"
        },
        {
          "coordinates": [
            0.093056,
            0.417485,
            0.576389,
            0.418959,
            0.577083,
            0.433694,
            0.09375,
            0.43222
          ],
          "element_id": "064f488528b60501646fb7623784f940f5dc5827ed83dce84ee7abe08b260b8a",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "4638c27e2ab47769aac104c08d5f2ed958c0fd419ed1347083b248e816b7e1cb"
          },
          "page_number": 1,
          "text": "·Effectively managed creative projects, promoting a superior corporate image.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.09375,
            0.436149,
            0.635417,
            0.436149,
            0.635417,
            0.463163,
            0.09375,
            0.463163
          ],
          "element_id": "1e9d974d85c0c91ccb3b4097e28f8de841c76a806c21269b5a44fdb8c974956b",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "4638c27e2ab47769aac104c08d5f2ed958c0fd419ed1347083b248e816b7e1cb"
          },
          "page_number": 1,
          "text": "·Designed and implemented direct mail campaigns, resulting in a 10% sales increase per quarter.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.092361,
            0.470039,
            0.622917,
            0.470039,
            0.622917,
            0.501473,
            0.092361,
            0.501473
          ],
          "element_id": "349e1b77dc2d2d3e36cbb6ac4a20c9a32f3ccb4be6b67169e43e94aa501b3873",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "4638c27e2ab47769aac104c08d5f2ed958c0fd419ed1347083b248e816b7e1cb"
          },
          "page_number": 1,
          "text": "·Developed and maintained internal and external relationships, which were crucial to company enhancement and success.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.09375,
            0.501965,
            0.595139,
            0.501965,
            0.595139,
            0.534381,
            0.09375,
            0.534381
          ],
          "element_id": "6aa721a8d84abeee7b0bcd300a80666334808f839927a665aee279a87fa63f4a",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "4638c27e2ab47769aac104c08d5f2ed958c0fd419ed1347083b248e816b7e1cb"
          },
          "page_number": 1,
          "text": "·Assessed the strategies of competitors, while avidly working to increase our own productivity.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.072917,
            0.550098,
            0.438889,
            0.550098,
            0.438889,
            0.564342,
            0.072917,
            0.564342
          ],
          "element_id": "0aa81ac921ed926488b40970a10ccc407a8daa8d4b92c4792f7c4becb0697d9b",
          "metadata": {
            "category_depth": 0,
            "children_ids": [
              "2042ef5cc240b0c24decfa8f5b25bf05ef7e45ebc53ac468e516cbf999e3afe2",
              "28dfd5942cf296e9981178203115c240ef9aa88eb4c05d7ead7eda5675ed8a31",
              "466ca0ce955ba9b9ea1474a296e59a1373341385c576b7967ff367db1a909205",
              "1d63d4f100a056ea4ee313cf426a83a7631d26ef2f04c7742189f9a803328d35",
              "e21c0699f9a6e142037b6a166236b615f4a5f3ec244fd7b3bf5f56993878841a",
              "20dfb95b6435b0ac763c720886c4d4381688ba6c330d837d2e4cc4e35236106c",
              "352f1047b7e57d1c8561873069d43b5c89a05cb4f4e6dc17a2f06999b8533598",
              "71405ec9e5a578f47fae860c058e3020844fdd70cdbe3211387e2a725bb270e9"
            ],
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false
          },
          "page_number": 1,
          "text": "Online Marketing Consultant, Freelance",
          "type": "Title"
        },
        {
          "coordinates": [
            0.072917,
            0.575147,
            0.294444,
            0.575147,
            0.294444,
            0.586444,
            0.072917,
            0.586444
          ],
          "element_id": "2042ef5cc240b0c24decfa8f5b25bf05ef7e45ebc53ac468e516cbf999e3afe2",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "0aa81ac921ed926488b40970a10ccc407a8daa8d4b92c4792f7c4becb0697d9b"
          },
          "page_number": 1,
          "text": "Aug 2009-Jun 2017,Telecommute",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.092361,
            0.600688,
            0.65,
            0.600688,
            0.65,
            0.612967,
            0.092361,
            0.612967
          ],
          "element_id": "28dfd5942cf296e9981178203115c240ef9aa88eb4c05d7ead7eda5675ed8a31",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "0aa81ac921ed926488b40970a10ccc407a8daa8d4b92c4792f7c4becb0697d9b"
          },
          "page_number": 1,
          "text": "·Researched the mnotivations of users and consumers to better understand company goals.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.092361,
            0.617878,
            0.523611,
            0.617878,
            0.523611,
            0.629666,
            0.092361,
            0.629666
          ],
          "element_id": "466ca0ce955ba9b9ea1474a296e59a1373341385c576b7967ff367db1a909205",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "0aa81ac921ed926488b40970a10ccc407a8daa8d4b92c4792f7c4becb0697d9b"
          },
          "page_number": 1,
          "text": "·Put forth carefully planned strategies to improve company business.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.092361,
            0.634578,
            0.652778,
            0.634578,
            0.652778,
            0.663556,
            0.092361,
            0.663556
          ],
          "element_id": "1d63d4f100a056ea4ee313cf426a83a7631d26ef2f04c7742189f9a803328d35",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "0aa81ac921ed926488b40970a10ccc407a8daa8d4b92c4792f7c4becb0697d9b"
          },
          "page_number": 1,
          "text": "·Fostering relationships to maintain existing clients, while developing new relationships to attract potential clients.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.092361,
            0.667485,
            0.627083,
            0.667485,
            0.627083,
            0.694499,
            0.092361,
            0.694499
          ],
          "element_id": "e21c0699f9a6e142037b6a166236b615f4a5f3ec244fd7b3bf5f56993878841a",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "0aa81ac921ed926488b40970a10ccc407a8daa8d4b92c4792f7c4becb0697d9b"
          },
          "page_number": 1,
          "text": "·Planned, executed, and led online marketing tactics, resulting in wide range company advancements.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.072917,
            0.714637,
            0.511111,
            0.714637,
            0.511111,
            0.72888,
            0.072917,
            0.72888
          ],
          "element_id": "20dfb95b6435b0ac763c720886c4d4381688ba6c330d837d2e4cc4e35236106c",
          "metadata": {
            "category_depth": 1,
            "children_ids": [
              "ddf8293d1d1f8fa3d55bb5cd20ea9781cef7b2768a20df418f645ae3dadbb7dd",
              "c2b0dc710392a6ff1cd2117e97a2b446c2b8e8d99920598648361e40d5ea304d",
              "d025167a977bed48a1e17180ab1573f46882d5165f0df4de474133de37e6c019",
              "7f6a6060cb204fd7dfa2e981c80c6cb12f51f9f7146b31e02e979b6aec17d2bd",
              "7c387ef1c88545175ee6c0689e539e43d8740212479c0a8f991c4dfd8ea95940"
            ],
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "0aa81ac921ed926488b40970a10ccc407a8daa8d4b92c4792f7c4becb0697d9b"
          },
          "page_number": 1,
          "text": "Sales and Marketing Director, Bee Hive Printing",
          "type": "Title"
        },
        {
          "coordinates": [
            0.074306,
            0.739194,
            0.248611,
            0.739194,
            0.248611,
            0.748527,
            0.074306,
            0.748527
          ],
          "element_id": "ddf8293d1d1f8fa3d55bb5cd20ea9781cef7b2768a20df418f645ae3dadbb7dd",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "20dfb95b6435b0ac763c720886c4d4381688ba6c330d837d2e4cc4e35236106c"
          },
          "page_number": 1,
          "text": "Oct 2009-Oct 2011,Dallas",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.092361,
            0.763261,
            0.468056,
            0.764244,
            0.468056,
            0.77947,
            0.092361,
            0.777996
          ],
          "element_id": "c2b0dc710392a6ff1cd2117e97a2b446c2b8e8d99920598648361e40d5ea304d",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "20dfb95b6435b0ac763c720886c4d4381688ba6c330d837d2e4cc4e35236106c"
          },
          "page_number": 1,
          "text": "·Oversaw sales, marketing, and business development goals.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.092361,
            0.782417,
            0.447222,
            0.782417,
            0.447222,
            0.792731,
            0.092361,
            0.792731
          ],
          "element_id": "d025167a977bed48a1e17180ab1573f46882d5165f0df4de474133de37e6c019",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "20dfb95b6435b0ac763c720886c4d4381688ba6c330d837d2e4cc4e35236106c"
          },
          "page_number": 1,
          "text": "·Planned strategies to develop new markets for printing.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.092361,
            0.797642,
            0.447222,
            0.797642,
            0.447222,
            0.812377,
            0.092361,
            0.812377
          ],
          "element_id": "7f6a6060cb204fd7dfa2e981c80c6cb12f51f9f7146b31e02e979b6aec17d2bd",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "20dfb95b6435b0ac763c720886c4d4381688ba6c330d837d2e4cc4e35236106c"
          },
          "page_number": 1,
          "text": "·Successfully planned and executed over 15 trade shows.",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.092361,
            0.814342,
            0.64375,
            0.814342,
            0.64375,
            0.829077,
            0.092361,
            0.829077
          ],
          "element_id": "7c387ef1c88545175ee6c0689e539e43d8740212479c0a8f991c4dfd8ea95940",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "20dfb95b6435b0ac763c720886c4d4381688ba6c330d837d2e4cc4e35236106c"
          },
          "page_number": 1,
          "text": "·increased brand presence, resulting in higher sales and more advantageous relationships. **SKILLS**",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.072917,
            0.86444,
            0.213889,
            0.86444,
            0.213889,
            0.875737,
            0.072917,
            0.875737
          ],
          "element_id": "352f1047b7e57d1c8561873069d43b5c89a05cb4f4e6dc17a2f06999b8533598",
          "metadata": {
            "category_depth": 1,
            "children_ids": [],
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "0aa81ac921ed926488b40970a10ccc407a8daa8d4b92c4792f7c4becb0697d9b"
          },
          "page_number": 1,
          "text": "EDUCATION",
          "type": "Title"
        },
        {
          "coordinates": [
            0.072917,
            0.894892,
            0.419444,
            0.894892,
            0.419444,
            0.909627,
            0.072917,
            0.909627
          ],
          "element_id": "71405ec9e5a578f47fae860c058e3020844fdd70cdbe3211387e2a725bb270e9",
          "metadata": {
            "category_depth": 1,
            "children_ids": [
              "a95404b49fb7d4cc1b5e0df094dbaf6a4d755dfef687a86622bde35ff281028d",
              "b9f07941dd1602084484d7cd7466398975d4b2c2559417cba97d2bb301c5042b",
              "cc4c062e0a904ac6d4f0a4451f80da5b9b0f3bb93960aca68f5ea5a145466fef",
              "99eed770808ba34ff7e597a93a3a6bfc0571208f945bf37ee2e6d336f6c65033",
              "e71ae02609c2dc711020efdefbf11f730f2eb3f2715c991c003ef7c51f31c0ff",
              "fd7c3cfe7cc712073a9097d26517062cd736b7b25fc71497d4c7498b4f5f4d12",
              "6fa0b3e86dc55df804b963a5b45fd70f9bfbe2d374ee5e813ad2833aaf78dbad",
              "876606a6d731b32df2fe9ed84a56ce0fde7ca28082bea531ce940aa4d885267a"
            ],
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "0aa81ac921ed926488b40970a10ccc407a8daa8d4b92c4792f7c4becb0697d9b"
          },
          "page_number": 1,
          "text": "Harvard College, Master of Marketing",
          "type": "Title"
        },
        {
          "coordinates": [
            0.752778,
            0.050589,
            0.83125,
            0.050589,
            0.83125,
            0.061395,
            0.752778,
            0.061395
          ],
          "element_id": "a95404b49fb7d4cc1b5e0df094dbaf6a4d755dfef687a86622bde35ff281028d",
          "metadata": {
            "category_depth": -1,
            "continuation_of": "7c387ef1c88545175ee6c0689e539e43d8740212479c0a8f991c4dfd8ea95940",
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": true,
            "parent_id": "71405ec9e5a578f47fae860c058e3020844fdd70cdbe3211387e2a725bb270e9"
          },
          "page_number": 1,
          "text": "SKILLS",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.754167,
            0.098723,
            0.916667,
            0.098723,
            0.916667,
            0.108546,
            0.754167,
            0.108546
          ],
          "element_id": "b9f07941dd1602084484d7cd7466398975d4b2c2559417cba97d2bb301c5042b",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "71405ec9e5a578f47fae860c058e3020844fdd70cdbe3211387e2a725bb270e9"
          },
          "page_number": 1,
          "text": "Communication Skills",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.752778,
            0.133595,
            0.904167,
            0.133595,
            0.904167,
            0.159627,
            0.752778,
            0.159627
          ],
          "element_id": "cc4c062e0a904ac6d4f0a4451f80da5b9b0f3bb93960aca68f5ea5a145466fef",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "71405ec9e5a578f47fae860c058e3020844fdd70cdbe3211387e2a725bb270e9"
          },
          "page_number": 1,
          "text": "Project Management \nSkills",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.752778,
            0.184676,
            0.922222,
            0.184676,
            0.922222,
            0.213163,
            0.752778,
            0.213163
          ],
          "element_id": "99eed770808ba34ff7e597a93a3a6bfc0571208f945bf37ee2e6d336f6c65033",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "71405ec9e5a578f47fae860c058e3020844fdd70cdbe3211387e2a725bb270e9"
          },
          "page_number": 1,
          "text": "Creativity and Problem \nSolving",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.754167,
            0.236248,
            0.884722,
            0.236248,
            0.884722,
            0.25,
            0.754167,
            0.25
          ],
          "element_id": "e71ae02609c2dc711020efdefbf11f730f2eb3f2715c991c003ef7c51f31c0ff",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "71405ec9e5a578f47fae860c058e3020844fdd70cdbe3211387e2a725bb270e9"
          },
          "page_number": 1,
          "text": "Digital Marketing",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.752083,
            0.27112,
            0.926389,
            0.27112,
            0.926389,
            0.299116,
            0.752083,
            0.299116
          ],
          "element_id": "fd7c3cfe7cc712073a9097d26517062cd736b7b25fc71497d4c7498b4f5f4d12",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "71405ec9e5a578f47fae860c058e3020844fdd70cdbe3211387e2a725bb270e9"
          },
          "page_number": 1,
          "text": "Industry Trends & Sales \nForecasting",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.072917,
            0.916994,
            0.284722,
            0.916994,
            0.284722,
            0.926817,
            0.072917,
            0.926817
          ],
          "element_id": "6fa0b3e86dc55df804b963a5b45fd70f9bfbe2d374ee5e813ad2833aaf78dbad",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "71405ec9e5a578f47fae860c058e3020844fdd70cdbe3211387e2a725bb270e9"
          },
          "page_number": 1,
          "text": "Aug 2009-Aug 2012,Cambridge",
          "type": "NarrativeText"
        },
        {
          "coordinates": [
            0.091667,
            0.939096,
            0.358333,
            0.94057,
            0.359028,
            0.952358,
            0.092361,
            0.950393
          ],
          "element_id": "876606a6d731b32df2fe9ed84a56ce0fde7ca28082bea531ce940aa4d885267a",
          "metadata": {
            "category_depth": -1,
            "data_source": {
              "record_locator": {
                "protocol": "file",
                "remote_file_path": "temp/paris-resume-templates.webp"
              },
              "url": "file://temp/paris-resume-templates.webp"
            },
            "is_continuation": false,
            "parent_id": "71405ec9e5a578f47fae860c058e3020844fdd70cdbe3211387e2a725bb270e9"
          },
          "page_number": 1,
          "text": "·Winner of the 2004 Hackley Fellowship.",
          "type": "NarrativeText"
        }
      ],
      "markdown": "\n![](/api/proxy/file?t=aHR0cHM6Ly93ZWItYXBpLnRleHRpbi5jb20vb2NyX2ltYWdlL2V4dGVybmFsLzcyZDcwMjFjNzBlMWFkMWMuanBn)\n\n# Susan Stone, Marketing Manager\n\n77 SERIAL DRIVE, AUSTIN, TX 78705, UNITED STATES·susan.12@gmail.com·(512)465-6312\n\n# PROFILE\n\nExperienced and energetic Marketing Manager with over seven years of experience effectively managing marketing projects from conception to completion. Adept in using digital marketing platforms to increase sales and overall company productivity. Experienced in preparing and overseeing online and print marketing campaigns, resulting in an increase in partner relations for the company. Adept in monitoring and reporting marketing objectives, to maintain necessary internal communications within the company. Pragmatic and result oriented,I am determined to build market presence in the next company I join.\n\n# EMPLOYMENT HISTORY\n\n## Marketing Manager, Zane Telecommunications\n\n## Nov 2011-Aug 2019,Austin\n\n·Effectively managed creative projects, promoting a superior corporate image.\n\n·Designed and implemented direct mail campaigns, resulting in a 10% sales increase per quarter.\n\n·Developed and maintained internal and external relationships, which were crucial to company enhancement and success.\n\n·Assessed the strategies of competitors, while avidly working to increase our own productivity.\n\n# Online Marketing Consultant, Freelance\n\nAug 2009-Jun 2017,Telecommute\n\n·Researched the mnotivations of users and consumers to better understand company goals.\n\n·Put forth carefully planned strategies to improve company business.\n\n·Fostering relationships to maintain existing clients, while developing new relationships to attract potential clients.\n\n·Planned, executed, and led online marketing tactics, resulting in wide range company advancements.\n\n## Sales and Marketing Director, Bee Hive Printing\n\nOct 2009-Oct 2011,Dallas\n\n·Oversaw sales, marketing, and business development goals.\n\n·Planned strategies to develop new markets for printing.\n\n·Successfully planned and executed over 15 trade shows.\n\n·increased brand presence, resulting in higher sales and more advantageous relationships. **SKILLS**\n\n## EDUCATION\n\n## Harvard College, Master of Marketing\n\nCommunication Skills\n\nProject Management \n\nSkills\n\nCreativity and Problem \n\nSolving\n\nDigital Marketing\n\nIndustry Trends & Sales \n\nForecasting\n\nAug 2009-Aug 2012,Cambridge\n\n·Winner of the 2004 Hackley Fellowship.\n\n<!-- Excellent -->\n\n",
      "metadata": {
        "data_source": {
          "record_locator": {
            "protocol": "file",
            "remote_file_path": "temp/paris-resume-templates.webp"
          },
          "url": "file://temp/paris-resume-templates.webp"
        },
        "filename": "6105fc0cb3c9497ab624844ebc.webp",
        "filetype": "image/webp",
        "page_count": 1
      },
      "schema_version": "1.3.0",
      "success_count": 1,
      "summary": {
        "duration_ms": 1127
      }
    }
  }
];
