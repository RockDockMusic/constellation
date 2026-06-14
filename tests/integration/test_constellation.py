from gltest import get_contract_factory, create_account
from gltest.assertions import tx_execution_succeeded

VERDICTS = ("FORGED", "FRAYED", "SNAPPED")


def test_link_consensus():
    factory = get_contract_factory("Constellation")
    contract = factory.deploy(args=[])

    # Found a constellation with a seed star (deterministic, no AI).
    rc1 = contract.found_constellation(
        args=["A journey across the dying stars", "A lone ship leaves the cold sun behind."]
    ).transact()
    assert tx_execution_succeeded(rc1)

    charts = contract.get_constellations(args=[0]).call()
    assert len(charts) == 1
    chart_id = charts[0]["id"]
    assert int(charts[0]["star_count"]) == 1

    # A different author adds the next star, a coherent continuation. The AI
    # Stargazer judges the link to the tail under validator consensus.
    author_b = create_account()
    rc2 = contract.connect(author_b).add_star(
        args=[chart_id, "It drifts toward a blue world rumored to still hold water."]
    ).transact()
    assert tx_execution_succeeded(rc2)

    chart = contract.get_constellation(args=[chart_id]).call()
    assert int(chart["attempts"]) == 2
    last = chart["last_attempt"]
    assert last["verdict"] in VERDICTS
    # Deterministic branch: accepted links extend the chain, snapped ones do not.
    if last["verdict"] in ("FORGED", "FRAYED"):
        assert int(chart["star_count"]) == 2
    else:
        assert int(chart["star_count"]) == 1

    stars = contract.get_stars(args=[chart_id, 0]).call()
    assert len(stars) == int(chart["star_count"])
    assert stars[0]["n"] == 1
